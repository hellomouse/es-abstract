var $isNaN = Number.isNaN || function (number: number): boolean { return number !== number; };

export = Number.isFinite || function (x: number): boolean { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };
