'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var escape = require('../escape');

/**
 * Serialize a code block to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.DIVBLOCK).then(function (state) {
    var node = state.peek();
    var syntax = node.data.get('class');
    var className = syntax ? ' class="' + syntax + '"' : '';
    return state.shift().write('<div' + className + '>' + state.serialize(node.nodes) + '</div>\n');
});

module.exports = { serialize: serialize };