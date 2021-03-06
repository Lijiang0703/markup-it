'use strict';

var _VOID;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BLOCKS = require('./blocks');
var INLINES = require('./inlines');

var VOID = (_VOID = {}, _defineProperty(_VOID, BLOCKS.HR, true), _defineProperty(_VOID, INLINES.IMAGE, true), _defineProperty(_VOID, BLOCKS.ADV_TABLE, true), _defineProperty(_VOID, BLOCKS.VIDEO, true), _defineProperty(_VOID, BLOCKS.TOC, true), _VOID);

module.exports = VOID;