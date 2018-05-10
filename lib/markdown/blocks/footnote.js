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
    var id = node.data.get('id');

    if (!inner.match(/.*\s.+/)) {
        var reg = /[\u4E00-\u9FFF]|[\u3400-\u4DBF]|(?:[\uD840-\uD868][\uDC00-\uDFFF]|\uD869[\uDC00-\uDEDF])|(?:\uD869[\uDF00-\uDFFF]|[\uD86A-\uD86C][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF3F])|(?:\uD86D[\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1F])|(?:\uD86E[\uDC20-\uDFFF]|[\uD86F-\uD872][\uDC00-\uDFFF]|\uD873[\uDC00-\uDEAF])|[\uF900-\uFAFF]|[\u3300-\u33FF]|[\uFE30-\uFE4F]|[\uF900-\uFAFF]|(?:\uD87E[\uDC00-\uDE1F])/;
        var isChinese = reg.test(inner);
        var patch = isChinese ? ' 。' : ' .';
        inner = inner + patch;
    }
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