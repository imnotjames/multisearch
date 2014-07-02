module.exports = (function() {
	'use strict';

	var RequestManager = function(options) {
		var _eventDom;

		var _eventName;

		var _request;

		var _savedCallbacks = {};

		var _callback = function(event) {
			var requestId = event.detail.id;
			var data = event.detail.data;
			var status = event.detail.status;
			var url = event.detail.url;

			var cb = _savedCallbacks[requestId];

			delete _savedCallbacks[requestId];

			cb(data, status, url);
		};

		var _failRequest = function(url, callback) {

		};

		this.initialize = function(options) {
			_eventDom = options.dom || document;
			_eventName = options.eventName || 'request-message';
			_request = options.request || _failRequest;

			_eventDom.addEventListener(_eventName, _callback);
		};

		this.request = function(url, callback) {
			var requestId = _request(url);

			_savedCallbacks[requestId] = callback;
		};

		this.initialize.call(this, options || {});
	};

	return RequestManager;
})();
