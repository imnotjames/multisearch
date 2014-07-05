module.exports = (function() {
	var SlideMenuView = function(options) {
		var _element;

		var _model;

		var _container;

		this.initialize = function(options) {
			_element = options.element || document.createElement('div');

			_model = options.model || null;

			_container = options.container || null;
		};

		this.toggle = function() {
			_container.classList.toggle('slide-menu-open');
		};

		this.getModel = function() {
			return _model;
		};

		this.getElement = function() {
			return _element;
		};

		this.render = function() {
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
		};

		this.initialize.call(this, options);
	};

	return SlideMenuView;
})();
