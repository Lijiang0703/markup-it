const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const { Map } = require('immutable');
const utils = require('../utils');
const reBlock = require('../re/block');
/**
 * Serialize an VIDEO block to markdown
 * @type {Serializer}
 */
const serialize = Serializer().matchType(BLOCKS.VIDEO).then(function (state) {
    const node = state.peek();
    const data = node.data;
    const src = data.get('src');
    // const embed = data.get('embed');
    const operator = data.get('operator') || 'mp4'

    const inner = `@[${operator}](${src})`;
    return state
        .shift()
        .write(inner +'\n\n');
});

/**
 * Deserialize an VIDEO block to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer().matchRegExp(reBlock.video, function (state, match) {
    const data = Map({
        src: utils.unescapeURL(match[2]),
        embed: ['youku','tencent'].indexOf(match[1].trim())==-1 ? false : true,
        operator: match[1] ? utils.unescape(match[1]) : 'mp4'
    });

    const node = Block.create({
        type: BLOCKS.VIDEO,
        isVoid: true,
        data
    });

    return state.push(node);
});

module.exports = { serialize, deserialize };