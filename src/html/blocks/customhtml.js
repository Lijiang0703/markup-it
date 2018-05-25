const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize an Custom_HTML block to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.CUSTOM_HTML)
    .then(state => {
        const node = state.peek();

        return state
            .shift()
            .write(`${node.data.get('html')}\n\n`);
    });

module.exports = { serialize };
