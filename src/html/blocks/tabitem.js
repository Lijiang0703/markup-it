const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a tab to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TAB_ITEM)
    .then(state => {
        const node = state.peek();
        const inner = state.serialize(node.nodes);
        const id = node.data.get("id") || "";

        const str = `<div class="tab-pane" role="tabpanel" id="${id}">${inner}</div>`

        return state
            .shift()
            .write(str);
    });

module.exports = { serialize };