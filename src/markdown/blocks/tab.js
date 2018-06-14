const trimTrailingLines = require('trim-trailing-lines');
const { Serializer, BLOCKS } = require('../../');

const serialize = Serializer()
	.matchType(BLOCKS.TAB_LIST)
	.then((state)=>{
		const list = state.peek();
	    const { nodes } = list;

	    const output = 
	    	nodes.map((item, index)=> serializeTabItems(state, item, index))
	    	.join('')

	    return state.shift().write(output);
	    // return state.shift().write('#fhr');
	})

function serializeTabItems(state, item, index){
	const title = item.data.get('title')
	let body = state.use('block').serialize(item.nodes)

	body = '\n'+ trimTrailingLines(body)+ '\n'

	return '## '+ title + body;
	// return "# ge"
}

module.exports = { serialize }