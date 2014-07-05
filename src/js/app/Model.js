var jQuery = require('jquery');

var Extendable = require('app/Extendable');

module.exports = (function() {
	var Model = function(attributes) {
		attributes = attributes || {};

		this._callbacks = {};

		this._attributes = jQuery.extend(
			{},
			this.defaults || {},
			attributes
		);

		this.initialize.apply(this, arguments);
	}

	jQuery.extend(Model, Extendable);

	jQuery.extend(Model.prototype, {
		initialize: function(options) {
			// Do nothing
		},

		bind: function(type, callback, context) {
			if (!this._callbacks[type]) {
				this._callbacks[type] = [];
			}

			this._callbacks[type].push({
				context: context || this,
				callback: callback
			});
		},

		trigger: function(type, args) {
			if (!this._callbacks[type]) {
				return;
			}

			for (var i = 0; i < this._callbacks[type].length; i++) {
				var context = this._callbacks[type][i].context;
				var callback = this._callbacks[type][i].callback;

				callback.apply(context, args);
			}
		},

		unset: function(name) {
			delete this._attributes[name];
		},

		set: function(name, value) {
			var changed = false;
			var old;

			if (this._attributes[name] !== value) {
				changed = true;
				old = this._attributes[name];
			}

			this._attributes[name] = value;

			if (changed) {
				this.trigger('change:' + name, [ this, value, old ]);
				this.trigger('change',         [ this, name, value, old ]);
			}
		},

		get: function(name) {
			return this._attributes[name];
		},

		has: function(name) {
			if (typeof this._attributes[name] === 'undefined') {
				return false;
			}

			if (this._attributes[name] === null) {
				return false;
			}

			return true;
		}
	});

	return Model;
})();
