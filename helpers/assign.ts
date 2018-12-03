import bind = require('function-bind');
var has = bind.call(Function.call, Object.prototype.hasOwnProperty);

var $assign = Object.assign;

/**
 * Copy the values of all of the enumerable own properties from one or more source objects to a
 * target object. Returns the target object.
 * @param target The target object to copy to.
 * @param source The source object from which to copy properties.
*/
export = function assign<T, U>(target, source) {
	if ($assign) {
		return $assign<T, U>(target, source);
	}

	for (var key in source) {
		if (has(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};
