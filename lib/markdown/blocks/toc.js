'use strict';

var trimTrailingLines = require('trim-trailing-lines');

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var serialize = Serializer().matchType(BLOCKS.TOC).then(function (state) {
	var list = state.peek();
	var nodes = list.nodes;


	var output = '[TOC]';

	return state.shift().write(output);
});

module.exports = { serialize: serialize };