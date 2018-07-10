'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;
/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.TOC).then(function (state) {
	var node = state.peek();
	var data = node.data;
	var text = data.get('html') || "";

	return state.shift().write(text);
});

module.exports = { serialize: serialize };