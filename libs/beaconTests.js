var url = require('url'),
beaconTests = function (request) {
	var parsedRequest = url.parse(request.url);
	if (parsedRequest.pathname.match('/b/ss') !== null) {
		return({
			isBeacon: true,
			beaconName: 'Omniture',
		});
	}
	if (parsedRequest.host.match('adobetag.com') !== null) {
		return({
			isBeacon: false,
			beaconName: 'Adobe Tag Container',
		});
	}
	if (request.url.match('secure-au.imrworldwide.com/cgi-bin/m') !== null) {
		return({
			isBeacon: true,
			beaconName: 'Nielsen',
		});
	} 
	if ((request.url.match('__utm.gif') !== null | request.url.match('/collect') !== null) && parsedRequest.host === 'www.google-analytics.com') {
		return({
			isBeacon: true,
			beaconName: 'Google Analytics',
		});
	} 
	if ((request.url.match('__utm.gif') !== null | request.url.match('/collect') !== null) && parsedRequest.host === 'stats.g.doubleclick.net') {
		return({
			isBeacon: false,
			beaconName: 'Google Analytics via Doubleclick domain',
		});
	}
	if (parsedRequest.host.match('chartbeat.com') !== null) {
		return({
			isBeacon: true,
			beaconName: 'Chartbeat',
		});
	}
	if (request.url.match('www.facebook.com/connect') !== null) {
		return({
			isBeacon: false,
			beaconName: 'Facebook',
		});
	}
	if (request.url.match('pong.qubitproducts.com') !== null) {
		return({
			isBeacon: true,
			beaconName: 'Qubit',
		});
	}
	if (request.url.match('d3c3cq33003psk.cloudfront.net/opentag') !== null) {
		return({
			isBeacon: false,
			beaconName: 'Qubit tag manager',
		});
	}
	if (request.url.match('api.olark.com') !== null || request.url.match('events.olark.com') !== null) {
		return({
			isBeacon: false,
			beaconName: 'Olark'
		});
	}
	if (request.url.match('f_pdf') !== null && request.url.match('uid') !== null && request.url.match('cookie') !== null) {
		return({
			isBeacon: true,
			beaconName: 'Snowplow'
		});
	}
	if (request.url.match(/beacon.*\.newrelic.com/) !== null) {
		return({
			isBeacon: true,
			beaconName: 'New Relic'
		});
	}
	if (request.url.match('api.mixpanel.com/track') !== null) {
		return({
			isBeacon: true,
			beaconName: 'Mixpanel'
		});
	}
	if (request.url.match('statse.webtrendslive.com') !== null) {
		return({
			isBeacon: true,
			beaconName: 'Webtrends'
		});
	}
	if (parsedRequest.host.match('www.googletagmanager.com') !== null) {
		return({
			isBeacon: false,
			beaconName: 'Google Tag Manager'
		});
	}

};

module.exports = beaconTests;