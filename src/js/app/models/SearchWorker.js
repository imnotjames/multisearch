module.exports = (function() {
	'use strict';

	var SearchWorker = function(options) {
		var _callbacks = {};

		var _name = null;

		var _category = null;

		var _state = SearchWorker.STATE_WAITING;

		var _term = '';

		var _urlFetcher;

		var _failureText;
		var _needLoginText;

		var _searchURL = null;


		this.initialize = function(options) {
			_name = options.name || '';
			_category = options.category || null;

			_urlFetcher = options.urlFetcher || null;

			_failureText = new RegExp(options.failureText) || null;
			_needLoginText = new RegExp(options.needLoginText) || null;

			_searchURL = options.searchURL || null;
		};

		this.addCallback = function(type, context, callback) {
			if (!_callbacks[type]) {
				_callbacks[type] = [];
			}

			_callbacks[type].push({
				context: context,
				callback: callback
			});
		};

		var _triggerCallback = function(type, args) {
			if (!_callbacks || ! _callbacks[type]) {
				return;
			}

			for (var i = 0; i < _callbacks[type].length; i++) {
				var context = _callbacks[type][i].context;
				var callback = _callbacks[type][i].callback;

				callback.apply(context, args);
			}
		};

		var _setState = function(state) {
			if (_state != state) {
				_state = state;

				_triggerCallback('change-state', [ arguments ]);
			}
		};

		var _onSearchCompleteCallback = function(response, status, url) {
			if (!response.match(_failureText)) {
				_setState(SearchWorker.STATE_FOUND);
			} else {
				_setState(SearchWorker.STATE_NOTFOUND);
			}
		};

		this.setURLFetcher = function(fetcher) {
			_urlFetcher = fetcher;
		};

		this.getSearchTerm = function() {
			return _term;
		};

		this.setSearchTerm = function(term) {
			_term = term;
		};

		this.getName = function() {
			return _name;
		};

		this.getState = function() {
			return _state;
		};

		this.getSearchURL = function() {
			var url = _searchURL;

			if (!url) {
				return null;
			}

			url = url.replace('[query]', encodeURIComponent(this.getSearchTerm()));

			return url;
		};

		this.execute = function() {
			if (!_urlFetcher) {
				_setState(SearchWorker.STATE_ERROR);
				return;
			}

			var url = this.getSearchURL();

			if (!url) {
				_setState(SearchWorker.STATE_ERROR);
				return;
			}

			_setState(SearchWorker.STATE_WORKING);

			var context = this;

			_urlFetcher(url, _onSearchCompleteCallback);
		};

		this.initialize.call(this, options);
	};

	SearchWorker.STATE_DISABLED  = "disabled";

	SearchWorker.STATE_WAITING   = "waiting";
	SearchWorker.STATE_WORKING   = "working";
	SearchWorker.STATE_ERROR     = "error";

	SearchWorker.STATE_FOUND	 = "found";
	SearchWorker.STATE_NOTFOUND  = "notfound";
	SearchWorker.STATE_NEEDLOGIN = "needlogin";

	return SearchWorker;
})();
