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
    var className = node.data.get('class');
	return state.shift().write('<div class="' + className + '">' + state.serialize(node.nodes) + '</div>\n');
});

module.exports = { serialize: serialize };