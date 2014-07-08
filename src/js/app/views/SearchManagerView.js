var View = require('app/View');
var SearchWorkerView = require('app/views/SearchWorkerView');

module.exports = View.extend({
	initialize: function(options) {

	},

	getTagName: function() {
		return 'table';
	},

	render: function() {
		var element = this.getElement();

		element.classList.add('table');
		element.classList.add('table-striped')

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
	}
});
