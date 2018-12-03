'use strict';

import assign = require('./helpers/assign');

import ES5 = require('./es5');
import ES2015 = require('./es2015');
import ES2016 = require('./es2016');
import ES2017 = require('./es2017');
import ES2018 = require('./es2018');

var ES = {
	ES5: ES5,
	ES6: ES2015,
	ES2015: ES2015,
	ES7: ES2016,
	ES2016: ES2016,
	ES2017: ES2017,
	ES2018: ES2018
};
assign(ES, ES5);
delete ES.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible
assign(ES, ES2015);

export = ES;
