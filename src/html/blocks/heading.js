const { Serializer, BLOCKS } = require('../../');
const serializeTag = require('../serializeTag');

const RULES = {
    [BLOCKS.HEADING_1]: serializeTag('h1', { getAttrs }),
    [BLOCKS.HEADING_2]: serializeTag('h2', { getAttrs }),
    [BLOCKS.HEADING_3]: serializeTag('h3', { getAttrs }),
    [BLOCKS.HEADING_4]: serializeTag('h4', { getAttrs }),
    [BLOCKS.HEADING_5]: serializeTag('h5', { getAttrs }),
    [BLOCKS.HEADING_6]: serializeTag('h6', { getAttrs })
};

/**
 * Serialize a heading to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(Object.keys(RULES))
    .then(state => {
        const node = state.peek();
        return RULES[node.type](state);
    });

/**
 * @param {Node} headingNode
 * @return {Object} The attributes names/value for the heading
 */
function getAttrs(headingNode) {
    return {
        id: headingNode.data.get('id') || uuid(4)
    };
}
function uuid(count){//用来生成unique字符串
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		if(!count)
			return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
		else{
			var r='';
			while(count--){
				r=r+s4();
			}
			return r;
		}
	},
module.exports = { serialize };
