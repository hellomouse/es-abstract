import $isNaN = require('./isNaN');

export = Number.isFinite || function (x: number): boolean { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };
