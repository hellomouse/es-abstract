'use strict';

import bind = require('function-bind');
import keys = require('object-keys');

import ES2017 = require('./es2017');
import assign = require('./helpers/assign');
import forEach = require('./helpers/forEach');

import GetIntrinsic = require('./GetIntrinsic');

var $String = GetIntrinsic('%String%') as StringConstructor;
var $Object = GetIntrinsic('%Object%') as ObjectConstructor;

var $SymbolProto = GetIntrinsic('%SymbolPrototype%', true) as SymbolConstructor["prototype"];
var $SymbolValueOf = ($SymbolProto ? bind.call(Function.call, $SymbolProto.valueOf) : null) as (value: any) => Symbol;
var $StringProto = GetIntrinsic('%StringPrototype%') as StringConstructor["prototype"];
var $charAt = bind.call(Function.call, $StringProto.charAt) as (string: string, pos: number) => string;

var $PromiseResolveOrig = GetIntrinsic('%Promise_resolve%', true) as PromiseConstructor['resolve'];
var $PromiseResolve = $PromiseResolveOrig ? bind.call(Function.call, $PromiseResolveOrig) : null;

var $isEnumerable = bind.call(Function.call, GetIntrinsic('%ObjectPrototype%').propertyIsEnumerable) as (o: any, v: string | number | symbol) => boolean;
var $pushApply = bind.call(Function.apply, GetIntrinsic('%ArrayPrototype%').push) as ArrayConstructor["prototype"]["push"];
var $gOPS = $SymbolValueOf ? $Object.getOwnPropertySymbols : null;

var OwnPropertyKeys = function OwnPropertyKeys(ES, source) {
	var ownKeys = keys(source);
	if ($gOPS) {
		$pushApply(ownKeys, $gOPS(source));
	}
	return ownKeys;
};

var ES2018 = assign(assign({}, ES2017), {
	EnumerableOwnPropertyNames: ES2017.EnumerableOwnNames,

	// https://ecma-international.org/ecma-262/9.0/#sec-thissymbolvalue
	thisSymbolValue: function thisSymbolValue(value: any): Symbol {
		if (!$SymbolValueOf) {
			throw new SyntaxError('Symbols are not supported; thisSymbolValue requires that `value` be a Symbol or a Symbol object');
		}
		if (this.Type(value) === 'Symbol') {
			return value;
		}
		return $SymbolValueOf(value);
	},

	// https://www.ecma-international.org/ecma-262/9.0/#sec-isstringprefix
	IsStringPrefix: function IsStringPrefix(p: string, q: string) {
		if (this.Type(p) !== 'String') {
			throw new TypeError('Assertion failed: "p" must be a String');
		}

		if (this.Type(q) !== 'String') {
			throw new TypeError('Assertion failed: "q" must be a String');
		}

		if (p === q || p === '') {
			return true;
		}

		var pLength = p.length;
		var qLength = q.length;
		if (pLength >= qLength) {
			return false;
		}

		// assert: pLength < qLength

		for (var i = 0; i < pLength; i += 1) {
			if ($charAt(p, i) !== $charAt(q, i)) {
				return false;
			}
		}
		return true;
	},

	// https://www.ecma-international.org/ecma-262/9.0/#sec-tostring-applied-to-the-number-type
	NumberToString: function NumberToString(m: number): string {
		if (this.Type(m) !== 'Number') {
			throw new TypeError('Assertion failed: "m" must be a String');
		}

		return $String(m);
	},

	// https://www.ecma-international.org/ecma-262/9.0/#sec-copydataproperties
	CopyDataProperties: function CopyDataProperties(target, source: null, excludedItems: any[]) {
		if (this.Type(target) !== 'Object') {
			throw new TypeError('Assertion failed: "target" must be an Object');
		}

		if (!this.IsArray(excludedItems)) {
			throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
		}
		for (var i = 0; i < excludedItems.length; i += 1) {
			if (!this.IsPropertyKey(excludedItems[i])) {
				throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
			}
		}

		if (typeof source === 'undefined' || source === null) {
			return target;
		}

		var ES = this;

		var fromObj = ES.ToObject(source);

		var sourceKeys = OwnPropertyKeys(ES, fromObj);
		forEach(sourceKeys, function (nextKey) {
			var excluded = false;

			forEach(excludedItems, function (e) {
				if (ES.SameValue(e, nextKey) === true) {
					excluded = true;
				}
			});

			var enumerable = $isEnumerable(fromObj, nextKey) || (
				// this is to handle string keys being non-enumerable in older engines
				typeof source === 'string'
				&& nextKey >= 0
				&& ES.IsInteger(ES.ToNumber(nextKey))
			);
			if (excluded === false && enumerable) {
				var propValue = ES.Get(fromObj, nextKey);
				ES.CreateDataProperty(target, nextKey, propValue);
			}
		});

		return target;
	},

	// https://ecma-international.org/ecma-262/9.0/#sec-promise-resolve
	PromiseResolve: function PromiseResolve(C, x) {
		if (!$PromiseResolve) {
			throw new SyntaxError('This environment does not support Promises.');
		}
		return $PromiseResolve(C, x);
	}
});

delete ES2018.EnumerableOwnProperties; // replaced with EnumerableOwnPropertyNames
if (!ES2018.EnumerableOwnPropertyNames) {
	delete ES2018.EnumerableOwnPropertyNames; // until it exists
}

export = ES2018;
