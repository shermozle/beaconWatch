#!/usr/bin/env node

/*
	TODO
	* Write tests for existence of particular beacons
	* Interface somewhere so you can automate this shit
	* Use Saucelabs instead of local Selenium
	* GTM test mode
*/

var http = require('http'),
		httpProxy = require('http-proxy'),
		url = require('url'),
		fs = require('fs'),
		colors = require('colors'),
		proxyPort = Math.floor(Math.random()*(12000-8000+1)+8000),
		webdriver = require('selenium-webdriver'),
		proxy = require('selenium-webdriver/proxy'),
		beacons = {},
		interestingRequest = {},
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

/*
	Proxy server that pushes any requests for s_code.js to run through the server defined above.
	Looks at all requests and logs any analytics beacon requests to the console.
*/
var proxyServer = httpProxy.createProxy();

var outboundServer = require('http').createServer(function(req, res) {
	if (argv.debug) {
		console.log('Proxy: '.red.bold + req.url);
	}
	isThisInteresting(req);
	proxyServer.web(req, res, {
		target: req.url
	}, function(e) {
		console.log('Proxy error: '.red.bold + req.url);
		console.log(e);
	});
}).listen(proxyPort);

var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.firefox())
		.setProxy(proxy.manual({
			http: 'localhost:' + proxyPort
		}))
    .build();

driver.manage().timeouts().pageLoadTimeout(60000);
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
});

var isThisInteresting = function (request) {
	var beacon = testForBeacons(request);
	if (beacon) {
		beacons[beacon.type] = beacons[beacon.type] || [];
		beacons[beacon.type].push(request.url);
	} else {
		return false;
	}
};

var testForBeacons = function (request) {
	var parsedRequest = url.parse(request.url);
	if (parsedRequest.pathname.match('/b/ss') !== null) {
		return({
			type: 'Omniture',
		});
	} else
	if (parsedRequest.host.match('adobetag.com') !== null) {
		return({
			type: 'Adobe Tag Container',
		});
	} else
	if (request.url.match('secure-au.imrworldwide.com/cgi-bin/m') !== null) {
		return({
			type: 'Nielsen',
		});
	} else
	if (request.url.match('__utm.gif') !== null) {
		return({
			type: 'Google Analytics',
		});
	}
	if (parsedRequest.host.match('chartbeat.com') !== null) {
		return({
			type: 'Chartbeat',
		});
	}
	if (request.url.match('www.facebook.com/connect') !== null) {
		return({
			type: 'Facebook',
		});
	}
	if (request.url.match('pong.qubitproducts.com') !== null) {
		return({
			type: 'Qubit',
		});
	}
	if (request.url.match('d3c3cq33003psk.cloudfront.net/opentag') !== null) {
		return({
			type: 'Qubit tag manager',
		});
	}

	else {
		return(false);
	}
};
