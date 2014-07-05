var jQuery = require('jquery');

var Model = require('app/Model');

var SearchWorker = {
	STATE_DISABLED: "disabled",
	STATE_WAITING: "waiting",
	STATE_WORKING: "working",
	STATE_ERROR: "error",

	STATE_FOUND: "found",
	STATE_NOTFOUND: "notfound",
	STATE_NEEDLOGIN: "needlogin"
};

module.exports = Model.extend({
	defaults: {
		name: 'Unnamed',
		category: null,
		state: 'waiting',
		term: '',
		fetcher: null,
		failureText: '',
		loginText: '',
	},

	getSearchURL: function() {
		var url = this.get('url');

		if (!url) {
			return null;
		}

		url = url.replace('[query]', encodeURIComponent(this.get('term')));

		return url;
	},

	_onSearchCompleteCallback: function(response, status, url) {
		if (!response.match(this.get('failureText'))) {
			this.set('state', SearchWorker.STATE_FOUND);
		} else {
			this.set('state', SearchWorker.STATE_NOTFOUND);
		}
	},

	execute: function() {
		var fetcher = this.get('fetcher');

		if (!fetcher) {
			console.log("no fetch");
			this.set('state', SearchWorker.STATE_ERROR);
			return;
		}

		var url = this.getSearchURL();

		if (!url) {
			console.log("no url");
			this.set('state', SearchWorker.STATE_ERROR);
			return;
		}

		this.set('state', SearchWorker.STATE_WORKING);

		var context = this;

		fetcher(url, jQuery.proxy(this._onSearchCompleteCallback, this));
	}
}, SearchWorker);
