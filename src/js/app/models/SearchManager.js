var Model = require('app/Model');
var SearchWorker = require('app/models/SearchWorker');

module.exports = Model.extend({
	initialize: function(options) {
		options = options || {};

		this.bind(
			'change:fetcher',
			function(model, value) {
				var workers = this.getWorkers();

				for (var i = 0; i < workers.length; i++) {
					workers[i].set('fetcher', value);
				}
			}
		);

		var workers = [];

		workers.push(
			new SearchWorker({
				name: 'Multisearch github search',
				failureText: '(We couldn&#39;t find any code matching|We could not perform)',
				urlFetcher: options.fetcher,
				url: 'https://github.com/imnotjames/multisearch/search?q=[query]'
			})
		);

		workers.push(
			new SearchWorker({
				name: 'Global github search',
				failureText: '(We couldn&#39;t find any code matching|Search more than)',
				urlFetcher: options.fetcher,
				url: 'https://github.com/search?q=[query]'
			})
		);

		this.set('workers', workers);
	},

	getWorkers: function() {
		return this.get('workers');
	},

	execute: function() {
		var term = this.get('term');
		var workers = this.get('workers');

		for (var i = 0; i < workers.length; i++) {
			workers[i].set('term', term);

			workers[i].execute();
		}
	}
});
