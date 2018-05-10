const { Serializer, BLOCKS } = require('../../');
/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
	.matchType(BLOCKS.ADV_TABLE)
	.then((state)=>{
		const node = state.peek();
		const id = node.data.get('id');
	    const text = node.data.get('html') || "<advtable id='"+id+"'></advtable>";
	    
	    return state
	    	.shift()
	    	.write(text)
	});

module.exports = { serialize };