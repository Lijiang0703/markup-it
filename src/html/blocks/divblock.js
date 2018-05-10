const { Serializer, BLOCKS } = require('../../');
/**
 * Serialize a code block to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
	.matchType(BLOCKS.DIVBLOCK)
	.then(function (state) {
	    const node = state.peek();
	    const className = node.data.get('class');
	 	return state
	 		.shift()
	 		.write('<div class="' + className + '">' + state.serialize(node.nodes) + '</div>\n');
	});

module.exports = { serialize };