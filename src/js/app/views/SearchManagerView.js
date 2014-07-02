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
