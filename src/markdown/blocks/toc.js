const trimTrailingLines = require('trim-trailing-lines');
const { Serializer, BLOCKS } = require('../../');

const serialize = Serializer()
	.matchType(BLOCKS.TOC)
	.then((state)=>{
		const list = state.peek();
	    const { nodes } = list;

	    const output = '[TOC]'

	    return state.shift().write(output);
	})

module.exports = { serialize }
