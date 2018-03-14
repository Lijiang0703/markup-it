'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;

var reBlock = require('../re/block');

/**
 * Serialize an VIDEO block to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.VIDEO).then(function (state) {
    var node = state.peek();
    var data = node.data;
    var src = data.get('src');
    var embed = data.get('embed');
    var operator = data.get('operator')

    return state.shift().write(embed ? '@[' + operator+ ']('+ src+ ')' : '@[ ]('+ src+ ')');
});

/**
 * Deserialize an VIDEO block to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.video, function (state, match) {
    var data = Map({
        src: utils.unescapeURL(match[1]),
        embed: match[2] ? utils.unescape(match[2]) : undefined,
        operator: match[3] ? utils.unescape(match[3]) : ' '
    }).filter(Boolean);

    var node = Block.create({
        type: BLOCKS.VIDEO,
        isVoid: true,
        data: data
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };