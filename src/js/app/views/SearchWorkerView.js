var View = require('app/View');

var SearchWorkerIconView = require('app/views/SearchWorkerIconView')

module.exports = View.extend({
	initialize: function(options) {
		var model = this.getModel();

		model.bind(
			'change:state',
			this._onChangeState,
			this
		);

		this._iconView = new SearchWorkerIconView({
			model: model
		});
	},

	_onChangeState: function() {
		this.render();
	},

	getTagName: function() {
		return 'tr';
	},

	render: function() {
		var element = this.getElement();

		element.innerHTML = '';

		var iconContainerElement = document.createElement('td');
		var labelContainerElement = document.createElement('td');

		iconContainerElement.classList.add('text-center');
		iconContainerElement.appendChild(this._iconView.getElement());

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
	}
});
