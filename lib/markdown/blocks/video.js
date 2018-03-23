'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;
var immu = require('immutable'),
    Map = immu.Map;

var utils = require('../utils');
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
    var operator = data.get('operator') || 'mp4'

    var inner = embed ? '@[' + operator+ ']('+ src+ ')' : '@['+ operator +']('+ src+ ')';
    return state.shift().write(inner +'\n\n');
});

/**
 * Deserialize an VIDEO block to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.video, function (state, match) {
    var data = Map({
        src: utils.unescapeURL(match[2]),
        embed: ['youku','tencent'].indexOf(match[1].trim()) ? false : true,
        operator: match[1] ? utils.unescape(match[1]) : 'mp4'
    }).filter(Boolean);

    var node = Block.create({
        type: BLOCKS.VIDEO,
        isVoid: true,
        data: data
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };