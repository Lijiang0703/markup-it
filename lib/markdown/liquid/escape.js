'use strict';

var _require = require('immutable'),
    OrderedMap = _require.OrderedMap;

var _require2 = require('../../utils/escape'),
    escapeWith = _require2.escapeWith,
    unescapeWith = _require2.unescapeWith;

// Replacements for properties escapement


var REPLACEMENTS = OrderedMap([['\\', '\\\\'], ['*', '\\*'], ['#', '\\#'], ['(', '\\('], [')', '\\)'], ['[', '\\['], [']', '\\]'], ['`', '\\`'], ['_', '\\_'], ['|', '\\|'], ['"', '\\"'], ['\'', '\\\'']]);

module.exports = {
    escape: function escape(str) {
        return escapeWith(REPLACEMENTS, str);
    },

    // User-inserted slashes have to be escaped first.
    // But they need to be unescaped last as markupit adds slashes itself.
    // So first we unescape the slashes combined with something else and end by unescaping the lone-slashes.
    unescape: function unescape(str) {
        return unescapeWith(REPLACEMENTS.reverse(), str);
    }
};