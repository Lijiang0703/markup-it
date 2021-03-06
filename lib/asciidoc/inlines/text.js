'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer;

/**
 * Serialize a text node to Asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().matchKind('text').then(function (state) {
    var node = state.peek();
    var text = node.text;


    return state.shift().write(text);
});

module.exports = { serialize: serialize };