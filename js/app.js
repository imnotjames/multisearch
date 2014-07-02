(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	var CURRENT_REQUEST_VERSION = '0.2';

	var SearchManager = require('./models/SearchManager');
	var SearchManagerView = require('./views/SearchManagerView');

	var manager = new SearchManager();


	var managerView = new SearchManagerView({ model: manager });

	document.addEventListener('DOMContentLoaded', function() {
		var requester = window.crossDomainRequest;
		var rVersion = window.crossDomainRequestVersion;

		if (!requester || !rVersion || rVersion() !== CURRENT_REQUEST_VERSION) {
			var requesterMissingPanel = document.getElementById('userscript-missing-modal');

			// Hacky way to display modal
			document.body.classList.add('modal-open');
			requesterMissingPanel.style.display = 'block';

			return;
		}

		manager.setURLFetcher(requester);

		var searchInput = document.getElementById('search');
		var searchResultsDiv = document.getElementById('search-results');

		searchResultsDiv.appendChild(managerView.getElement());

		managerView.render();

		searchInput.addEventListener(
			'change',
			function() {
				manager.setSearchTerm(searchInput.value);

				manager.execute();
			}
		);

		if (searchInput.value) {
			manager.setSearchTerm(searchInput.value);

			manager.execute();
		}
	});
})();

},{"./models/SearchManager":2,"./views/SearchManagerView":4}],2:[function(require,module,exports){
module.exports = (function() {
	'use strict';

	var SearchWorker = require('./SearchWorker');

	var SearchManager = function(options) {
		var _workers = [];

		var _term;

		var _urlFetcher;

		this.initialize = function(options) {
			_urlFetcher = options.urlFetcher || null;
			_term = options.term || "";

			_workers.push(
				new SearchWorker({
					name: 'Multisearch github search',
					failureText: '(We couldn&#39;t find any code matching|We could not perform)',
					urlFetcher: _urlFetcher,
					searchURL: 'https://github.com/imnotjames/multisearch/search?q=[query]'
				})
			);

			_workers.push(
				new SearchWorker({
					name: 'Global github search',
					failureText: '(We couldn&#39;t find any code matching|Search more than)',
					urlFetcher: _urlFetcher,
					searchURL: 'https://github.com/search?q=[query]'
				})
			);
		};

		this.getWorkers = function() {
			return _workers;
		};

		this.setURLFetcher = function(fetcher) {
			_urlFetcher = fetcher;

			for (var i = 0; i < _workers.length; i++) {
				_workers[i].setURLFetcher(fetcher);
			}
		},

		this.setSearchTerm = function(term) {
			_term = term;
		};

		this.execute = function() {
			for (var i = 0; i < _workers.length; i++) {
				_workers[i].setSearchTerm(_term);

				_workers[i].execute();
			}
		};

		this.initialize.call(this, options || {});
	};

	return SearchManager;
})();

},{"./SearchWorker":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = (function() {
	var SearchWorkerView = require('./SearchWorkerView');

	var SearchManagerView = function(options) {
		var _model = null;

		var _element = null;

		this.initialize = function(options) {
			_model = options.model;

			_element = document.createElement('table');

			_element.classList.add('table');
			_element.classList.add('table-striped')
		};

		this.getModel = function() {
			return _model;
		};

		this.getElement = function() {
			return _element;
		};

		this.render = function() {
			var element = this.getElement();

			element.innerHTML = '';

			var tbody = document.createElement('tbody');

			element.appendChild(tbody);

			if (this.getModel()) {
				var workers = this.getModel().getWorkers();

				for (var i = 0; i < workers.length; i++) {
					tbody.appendChild(
						new SearchWorkerView({ model: workers[i] }).render().getElement()
					);
				}
			}

			return this;
		};

		this.initialize.call(this, options || {});
	};

	return SearchManagerView;
})();

},{"./SearchWorkerView":6}],5:[function(require,module,exports){
module.exports = (function() {
	var SearchWorker = require('../models/SearchWorker');

	var SearchWorkerIconView = function(options) {
		var _prettyNameMap = {};

		_prettyNameMap[SearchWorker.STATE_FOUND]     = "Found";
		_prettyNameMap[SearchWorker.STATE_NOTFOUND]  = "Not Found";
		_prettyNameMap[SearchWorker.STATE_WORKING]   = "Working";
		_prettyNameMap[SearchWorker.STATE_DISABLED]  = "Disabled";
		_prettyNameMap[SearchWorker.STATE_WAITING]   = "Waiting";
		_prettyNameMap[SearchWorker.STATE_NEEDLOGIN] = "Needs Login";

		var _model = null;

		var _element = null;

		this.initialize = function(options) {
			_model = options.model;

			_element = document.createElement('div');

			_model.addCallback(
				'change-state',
				this,
				this._onChangeState
			);
		};

		this._onChangeState = function() {
			this.render();
		};

		this.getModel = function() {
			return _model;
		};

		this.getElement = function() {
			return _element;
		}

		this.render = function() {
			var element = this.getElement();
			element.innerHTML = '';

			var state = this.getModel().getState();

			var stateText = _prettyNameMap[state] || "Unknown State";

			var stateElement = document.createElement('div');

			stateElement.title = stateText;
			stateElement.classList.add('result');
			stateElement.classList.add('result-' + state);

			element.appendChild(stateElement);

			return this;
		};

		this.initialize.apply(this, arguments);
	};

	return SearchWorkerIconView;
})();

},{"../models/SearchWorker":3}],6:[function(require,module,exports){
module.exports = (function() {
	var SearchWorkerIconView = require('./SearchWorkerIconView')

	var SearchWorkerView = function(options) {
		var _model = null;

		var _element = null;

		var _iconView = null;

		this.initialize = function(options) {
			_model = options.model;

			_element = document.createElement('tr');

			_iconView = new SearchWorkerIconView({
				model: _model
			});

			_model.addCallback(
				'change-state',
				this,
				this._onChangeState
			);
		};

		this._onChangeState = function() {
			this.render();
		};

		this.getModel = function() {
			return _model;
		}

		this.getElement = function() {
			return _element;
		};

		this.render = function() {
			var element = this.getElement();

			element.innerHTML = '';

			var iconContainerElement = document.createElement('td');
			var labelContainerElement = document.createElement('td');

			iconContainerElement.classList.add('text-center');
			iconContainerElement.appendChild(_iconView.render().getElement());

			var labelText = '' + this.getModel().getName() +' - ' + this.getModel().getState();

			var searchURL = this.getModel().getSearchURL();

			if (searchURL) {
				var anchorElement = document.createElement('a');

				anchorElement.href = searchURL;

				anchorElement.innerHTML = labelText;

				labelContainerElement.appendChild(anchorElement);
			} else {
				labelContainerElement.innerHTML = labelText;
			}


			element.appendChild(iconContainerElement);
			element.appendChild(labelContainerElement);

			return this;
		};

		this.initialize.apply(this, arguments);
	};

	return SearchWorkerView;
})();

},{"./SearchWorkerIconView":5}],7:[function(require,module,exports){
/*global require */
(function () {
	'use strict';

	require('./app');
})();

},{"./app":1}]},{},[7]);