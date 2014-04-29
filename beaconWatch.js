#!/usr/bin/env node

var http = require('http'),
		httpProxy = require('http-proxy'),
		fs = require('fs'),
		colors = require('colors'),
		proxyPort = Math.floor(Math.random()*(12000-8000+1)+8000),
		webdriver = require('selenium-webdriver'),
		proxy = require('selenium-webdriver/proxy'),
		beacons = [],
		beaconTests = require('./libs/beaconTests'),
		localServer = require('./libs/localServer'),
		argv = require('optimist')
			.usage('Test the analytics beacons in a web page.\nUsage: $0')
			.demand('u')
			.alias('u', 'url')
			.describe('u', 'URL to test')
			.alias('r', 'require')
			.describe('r', 'Required analytics tools. One or more of: "omniture", "googleanalytics", "nielsen" separated by commas.')
			.alias('d', 'debug')
			.describe('d','Enable debugging output to console.')
			.argv;

if (argv.debug) {
	console.log('Proxy: '.red.bold + 'localhost:' + proxyPort);
}

/*
	Proxy server looks at all requests and works out which are interesting beacon requests.
*/
var proxyServer = httpProxy.createProxy();

var outboundServer = require('http').createServer(function(req, res) {
	if (argv.debug) {
		console.log('Request: '.blue.bold + req.url);
	}
	var beacon = beaconTests(req);
	if (beacon) {
		beacon.url = req.url;
		beacons.push(beacon);
	}
	if (beacon && beacon.isBeacon) {
		if (argv.debug) {
			console.log("Not proxying: ".blue.bold + req.url);
		}
		proxyServer.web(req, res, {
			target: 'http://localhost:' + localServer.serverPort
		}, function(e) {
			console.log('Not proxying error: '.red.bold + req.url);
			console.log(e);
		});
	} else {
		proxyServer.web(req, res, {
			target: req.url
		}, function(e) {
			console.log('Proxy error: '.red.bold + req.url);
			console.log(e);
		});
	}
}).listen(proxyPort);

var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.firefox())
		.setProxy(proxy.manual({
			http: 'localhost:' + proxyPort
		}))
    .build();

driver.manage().timeouts().pageLoadTimeout(120000);
driver.get(argv.url).then(function() {
	driver.getTitle().then(function(title) {
		console.log('Page title: '.blue.bold + title);
	});
}).then(function() {
	console.log(beacons);
}).then(function() {
	driver.quit();
}).then(function() {
	outboundServer.close();
}).then(function() {
	localServer.server.close();
});
