beaconWatch
===========

Use node.js to load web pages and parse out the analytics beacons of interest.

What is does is open a browser via Selenium, spin up a proxy server and tell
Selenium to use it, then browse to your URL. The proxy parses out the URLs of
beacons according to some basic rules.

Currently just a proof of concept. Aim is to have something that will drive
Saucelabs browsers to check in all browsers and to be build into some kind of
unit test framework. Also doesn't handle HTTPS so the Facebook beacons don't
work and it won't work with secure sites.

Requires these npm modules:
* httpProxy
* url
* colors
* selenium-webdriver
* optimist

You also need to have a locally running version of the Selenium server like:
http://selenium-release.storage.googleapis.com/2.41/selenium-server-standalone-2.41.0.jar

Run it with:
java -jar selenium-server-standalone-2.41.0.jar