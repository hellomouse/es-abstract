'use strict';

var ES = require('../').ES2017;

var ops = require('../operations/2017');

// jscs:disable
var expectedMissing = ['Construct', 'SetIntegrityLevel', 'TestIntegrityLevel', 'CreateArrayFromList', 'CreateListFromArrayLike', 'OrdinaryHasInstance', 'CreateListIterator', 'thisBooleanValue', 'thisNumberValue', 'thisTimeValue', 'thisStringValue', 'RegExpBuiltinExec', 'IsPromise', 'OrdinarySet', 'NormalCompletion', 'IsSharedArrayBuffer', 'EnumerableOwnProperties'];
// jscs:enable

require('./tests').es2017(ES, ops, expectedMissing);
