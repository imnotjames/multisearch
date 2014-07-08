var View = require('app/View');
var SearchWorker = require('app/models/SearchWorker');

module.exports = View.extend({
	initialize: function(options) {
		var model = this.getModel();

		model.bind(
			'change:state',
			this._onChangeState,
			this
		);

		this.render();
	},

	_onChangeState: function() {
		this.render();
	},

	_getPrettyNameForState: function(state) {
		var _prettyNameMap = {};

		_prettyNameMap[SearchWorker.STATE_FOUND]     = "Found";
		_prettyNameMap[SearchWorker.STATE_NOTFOUND]  = "Not Found";
		_prettyNameMap[SearchWorker.STATE_WORKING]   = "Working";
		_prettyNameMap[SearchWorker.STATE_DISABLED]  = "Disabled";
		_prettyNameMap[SearchWorker.STATE_WAITING]   = "Waiting";
		_prettyNameMap[SearchWorker.STATE_NEEDLOGIN] = "Needs Login";

		return _prettyNameMap[state] || "Unknown State";
	},

	render: function() {
		var element = this.getElement();
		element.innerHTML = '';

		var state = this.getModel().get('state');

		var stateText = this._getPrettyNameForState(state);

		var stateElement = document.createElement('div');

		stateElement.title = stateText;
		stateElement.classList.add('result');
		stateElement.classList.add('result-' + state);

		element.appendChild(stateElement);

		return this;
	}
});
