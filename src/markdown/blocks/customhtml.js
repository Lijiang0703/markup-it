const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Serialize a customhtml to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CUSTOM_HTML)
    .then((state) => {
        const node = state.peek();
        const data = node.data;
        const html = data.get('html').trim();

        return state
            .shift()
            .write(`\n<!--Start-->\n${html}\n<!--End-->\n`);
    });

/**
 * Deserialize a customhtml to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.custom_html, (state, match) => {
        const node = Block.create({
            type: BLOCKS.CUSTOM_HTML,
            data: {
                html: match[1]
            },
            isVoid: true
        });

        return state.push(node);
    });

module.exports = { serialize, deserialize };
