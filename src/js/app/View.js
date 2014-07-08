var Extendable = require('app/Extendable');

var jQuery = require('jquery');

module.exports = (function() {
	var View = function(options) {
		this._model = options.model || null;

		this.setElement(
			options.element || document.createElement(this.getTagName())
		);

		this.initialize.apply(this, arguments);
	};

	jQuery.extend(View, Extendable);

	jQuery.extend(View.prototype, {
		initialize: function(options) {},

		getTagName: function() {
			return 'div';
		},

		getModel: function() {
			return this._model;
		},

		getElement: function() {
			return this._element;
		},

		$: function(selector) {
			if (!this._$element) {
				return null;
			}

			if (typeof selector === 'undefined') {
				return this._$element;
			}

			return this._$element.find(selector);
		},

		setModel: function(model) {
			this._model = model;
		},

		setElement: function (element) {
			if (!element) {
				this._element = null;
				this._$element = null;
			} else {
				this._element = element;
				this._$element = jQuery(element);
			}
		},

		render: function() {
			return this;
		}
	});

	return View;

})();
