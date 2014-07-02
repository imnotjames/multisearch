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
