'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize a math node to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.MATH).then(function (state) {
    var node = state.peek();
    var data = node.data;

    var formula = data.get('formula');

    var output = '\n$$\n' + formula.trim() + '\n$$\n';

    return state.shift().write(output);
});

/**
 * Deserialize a math block into a paragraph with an inline math in it.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.math, function (state, match) {
    var formula = match[2].trim();

    if (state.getProp('math') === false || !formula) {
        return;
    }

    var node = Block.create({
        type: BLOCKS.MATH,
        isVoid: true,
        data: {
            formula: formula
        }
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };