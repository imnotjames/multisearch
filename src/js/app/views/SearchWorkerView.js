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

			_model.bind(
				'change:state',
				this._onChangeState,
				this
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

			var labelText = '' + this.getModel().get('name') +' - ' + this.getModel().get('state');

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
