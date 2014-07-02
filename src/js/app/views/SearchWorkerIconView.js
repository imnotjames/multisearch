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
		};

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
