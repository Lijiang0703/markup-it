const { Serializer, BLOCKS } = require('../../');

/**
 * Serialize a tab to HTML
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchType(BLOCKS.TAB_LIST)
    .then(state => {
        const node = state.peek();
        const nodes = node.nodes;
        const inner = state.serialize(nodes);

        const list = nodes.map((inode)=>{
            if(inode.type === "tabs-item"){
                let data = inode.data
                return `<li role="presentation"><a href="#${data.get('id')}" role="tab" data-toggle="tab">${data.get('title')}</a></li>`
            } 
        }).join('')

        const str =  `<div><ul class="nav nav-tabs" role="tablist">${list}</ul><div class="tab-content">${inner}</div></div>`

        return state
            .shift()
            .write(str);
    });

module.exports = { serialize };