const { Serializer, BLOCKS } = require('../../');
/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
	.matchType(BLOCKS.TOC)
	.then(state=>{
		  const node= state.peek();
      const data = node.data
      const text = data.html || "";

	    return state
	    	.shift()
	    	.write(text)
	});

module.exports = { serialize };
