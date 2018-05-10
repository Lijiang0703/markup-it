const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Serialize a footnote to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.FOOTNOTE)
    .then((state) => {
        const node = state.peek();
        let inner = state.use('inline').serialize(node.nodes);
        const id = node.data.get('id');

        if(!inner.match(/.*\s.+/)) {
          const reg = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
          const isChinese = reg.test(inner);
          const patch = isChinese ? ' 。' : ' .';
          inner = inner + patch;
        }
        return state
            .shift()
            .write(`[^${id}]: ${inner}\n\n`);
    });

/**
 * Deserialize a footnote to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.footnote, (state, match) => {
        const id = match[1];
        const text = match[2];
        const nodes = state.use('inline').deserialize(text);
        const node = Block.create({
            type: BLOCKS.FOOTNOTE,
            nodes,
            data: { id }
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };
