'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize a customhtml to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.CUSTOM_HTML).then(function (state) {
    var node = state.peek();
    var data = node.data;
    var html = data.get('html');

    return state.shift().write('<!--Start-->' + html + '<!--End-->');
});

/**
 * Deserialize a customhtml to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.custom_html, function (state, match) {
    var node = Block.create({
        type: BLOCKS.custom_html,
        data: {
            html: match[1]
        },
        isVoid: true
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };