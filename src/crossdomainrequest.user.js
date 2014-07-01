// ==UserScript==
// @name        Cross Domain Request
// @author      James Ward <james@notjam.es>
// @version     0.0.1
// @namespace   http://notjam.es/
// @description Exposes Cross Domain Requests for Multisearch
// @include     http://localhost:9001/*
// @include     http://www.notjam.es/multisearch/*
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function() {
	var callbackId = 0;

	var sendCrossDomainRequestMessage = function (id, response) {
		var data = {
			id: id,
			data: response.responseText,
			status: response.status,
			url: response.finalURL
		};

		// Get around FF30+ permission denied errors
		if (cloneInto) {
			data = cloneInto(data, unsafeWindow);
		}

		var cdrEvent = document.createEvent('CustomEvent');
		cdrEvent.initCustomEvent('cross-domain-request-message', true, true, data);
		console.log('dispatching');

		unsafeWindow.dispatchEvent(cdrEvent);
	};

	GM_xmlhttpRequest = (function () {
		var old = GM_xmlhttpRequest;

		return function (details) {
			var x = new Number(0);
			for (var i in details) x[i] = details[i];
			return old(x);
		};
	}());

	var crossDomainRequest = function (url) {
		var currentId = callbackId++;

		window.setTimeout(
			function() {
				GM_xmlhttpRequest(
					{
						method: "GET",
						url: url,
						onload: function(response) {
							sendCrossDomainRequestMessage(currentId, response);
						}
					}
				);
			},
			0
		);

		return currentId;
	};

	var crossDomainRequestVersion = function () {
		return GM_info.script.version;
	}

	if (exportFunction) {
		exportFunction(crossDomainRequest, unsafeWindow, { defineAs: 'crossDomainRequest' });
		exportFunction(crossDomainRequestVersion, unsafeWindow, { defineAs: 'crossDomainRequestVersion' });
	} else {
		unsafeWindow.crossDomainRequest = crossDomainRequest;
		unsafeWindow.crossDomainRequestVersion = crossDomainRequestVersion;
	}
}());
