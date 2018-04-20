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
 * Serialize an ADV_TABLE block to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.ADV_TABLE).then(function (state) {
    var node = state.peek();
    var data = node.data;
    var id = data.get('id');

    // var inner = embed ? '@[' + operator+ ']('+ src+ ')' : '@['+ operator +']('+ src+ ')';
    var inner = '@<table>('+id+')';
    return state.shift().write(inner +'\n\n');
});

/**
 * Deserialize an ADV_TABLE block to a node.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reBlock.adv_table, function (state, match) {
    var data = Map({
        id: utils.unescape(match[1])
    });

    var node = Block.create({
        type: BLOCKS.ADV_TABLE,
        isVoid: true,
        data: data
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };