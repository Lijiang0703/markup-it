const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const { Map } = require('immutable');
const utils = require('../utils');
const reBlock = require('../re/block');

/**
 * Serialize an ADV_TABLE block to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.ADV_TABLE)
    .then(function (state) {
        const node = state.peek();
        const data = node.data;
        const id = data.get('id');

        // const inner = embed ? '@[' + operator+ ']('+ src+ ')' : '@['+ operator +']('+ src+ ')';
        const inner = '@{table}('+id+')';
        return state
            .shift()
            .write(inner +'\n\n');
    });

/**
 * Deserialize an ADV_TABLE block to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.adv_table, function (state, match) {
        const data = Map({
            id: utils.unescape(match[1])
        });

        const node = Block.create({
            type: BLOCKS.ADV_TABLE,
            isVoid: true,
            data: data
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };