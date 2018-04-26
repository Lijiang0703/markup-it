'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize a footnote to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.FOOTNOTE).then(function (state) {
    var node = state.peek();
    var inner = state.use('inline').serialize(node.nodes);
    if(!inner.match(/.*\s.+/)) {
      var reg = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
      var isChinese = reg.test(inner);
      var patch = isChinese ? ' 。' : ' .';
      inner = inner + patch;
    }
    var id = node.data.get('id');

    return state.shift().write('[^' + id + ']: ' + inner + '\n\n');
});

/**
 * Deserialize a footnote to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.footnote, function (state, match) {
    var id = match[1];
    var text = match[2];
    var nodes = state.use('inline').deserialize(text);
    var node = Block.create({
        type: BLOCKS.FOOTNOTE,
        nodes: nodes,
        data: { id: id }
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };