var View = require('app/View');

module.exports = View.extend({
	initialize: function(options) {
		this._container = options.container || null;
	},

	getContainer: function() {
		return this._container;
	},

	toggle: function() {
		var container = this.getContainer();

		container.classList.toggle('slide-menu-open');
	},

	render: function() {
		var element = this.getElement();

		var workerList;

		for (var i = 0; i < element.childNodes.length; i++) {
			if (element.childNodes[i].id === 'worker-list') {
				workerList = element.childNodes[i];
				break;
			}
		}

		if (!workerList) {
			return;
		}

		workerList.innerHTML = '';

		var workers = this.getModel().getWorkers();

		for (var i = 0; i < workers.length; i++) {
			var workerListAnchor = document.createElement('a');
			var workerListRemoveButton = document.createElement('button');

			workerListAnchor.innerHTML = workers[i].get('name');
			workerListAnchor.href = '#';

			workerListRemoveButton.title = 'Remove this Site';
			workerListRemoveButton.innerHTML = '<span class="glyphicon glyphicon-trash"></span>';
			workerListRemoveButton.className = 'btn btn-danger btn-xs pull-right';

			var workerListItem = document.createElement('li');

			workerListItem.appendChild(workerListAnchor);
			workerListItem.appendChild(workerListRemoveButton);

			workerList.appendChild(workerListItem);
		}

		return this;
	}
});
