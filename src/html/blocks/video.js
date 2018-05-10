const { Serializer, BLOCKS } = require('../../');
/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
	.matchType(BLOCKS.VIDEO)
	.then(function(state){
		const node = state.peek();
	    const embed = node.data.get('embed');
		const tag = embed ? 'iframe' : 'video';

	    const text = "<"+ tag + " src='"+node.data.get('src')+"'></"+tag+">";
	    return state
	    	.shift()
	    	.write(text)
	});

module.exports = { serialize };