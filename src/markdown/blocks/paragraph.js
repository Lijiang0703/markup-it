const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const reBlock = require('../re/block');

/**
 * Serialize a paragraph to markdown
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.PARAGRAPH)
    .then((state) => {
        const node = state.peek();
        const inner = state
            .use('inline')
            .setProp('hardlineBreak', true)
            .serialize(node.nodes);

        return state
            .shift()
            .write(`${inner}\n\n`);
    });

/**
 * Deserialize a paragraph to a node.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .matchRegExp(reBlock.paragraph, (state, match) => {
        const parentDepth = state.depth - 1;
        const isInBlockquote = (state.getProp('blockquote') === parentDepth);
        const isInLooseList = (state.getProp('looseList') === parentDepth);
        var isInDivblock = state.getProp('divblock') === parentDepth;
    // console.log("---------------",state.getProp('divblock'))
        var isTop = state.depth === 2;
        
        if (!isTop && !isInBlockquote && !isInLooseList&& !isInDivblock) {
            return;
        }

        const text = collapseWhiteSpaces(match[1]);
        const nodes = state.use('inline').deserialize(text);
        const node = Block.create({
            type: BLOCKS.PARAGRAPH,
            nodes
        });

        return state.push(node);
    });

/*
 * Collapse newlines and whitespaces into a single whitespace. But preserve
 * hardline breaks '··⏎'
 */
function collapseWhiteSpaces(text) {
    return text
        // Remove hardline breaks
        .split('  \n')
        .map(part => part.trim().replace(/\s+/g, ' '))
        // Restore hardline breaks
        .join('  \n')
        .trim();
}

module.exports = { serialize, deserialize };
