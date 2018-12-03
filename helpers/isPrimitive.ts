export = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};
