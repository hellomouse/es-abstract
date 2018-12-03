'use strict';

export = function forEach(array: any[], callback: (value: any, index: number, array: any[]) => void) {
	for (var i = 0; i < array.length; i += 1) {
		callback(array[i], i, array);
	}
};
