'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize an Custom_HTML block to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.CUSTOM_HTML).then(function (state) {
    var node = state.peek();

    return state.shift().write(node.data.get('html') + '\n\n');
});

module.exports = { serialize: serialize };