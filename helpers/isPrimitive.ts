export = function isPrimitive(value: any) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};
