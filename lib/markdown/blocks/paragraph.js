'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize a paragraph to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.PARAGRAPH).then(function (state) {
    var node = state.peek();
    var inner = state.use('inline').setProp('hardlineBreak', true).serialize(node.nodes);

    return state.shift().write(inner + '\n\n');
});

/**
 * Deserialize a paragraph to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.paragraph, function (state, match) {
    var parentDepth = state.depth - 1;
    var isInBlockquote = state.getProp('blockquote') === parentDepth;
    var isInLooseList = state.getProp('looseList') === parentDepth;
    var isInDivblock = state.getProp('divblock') === parentDepth;
    // console.log("---------------",state.getProp('divblock'))
    var isTop = state.depth === 2;

    if (!isTop && !isInBlockquote && !isInLooseList && !isInDivblock) {
        return;
    }

    var text = match[1].trim();
    var nodes = state.use('inline').deserialize(text);
    var node = Block.create({
        type: BLOCKS.PARAGRAPH,
        nodes: nodes
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };