var jQuery = require('jquery');

module.exports = {
	extend: function(prototypeProperties, staticProperties) {
		var parent = this;
		var child = function(){ return parent.apply(this, arguments); };

		// Add static properties to the constructor function, if supplied.
		jQuery.extend(child, parent, staticProperties);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function(){ this.constructor = child; };
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;

		if (prototypeProperties) {
			jQuery.extend(child.prototype, prototypeProperties);
		}

		child.__super__ = parent.prototype;

		return child;
	}
};
