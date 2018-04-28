'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var serializeTag = require('../serializeTag');

/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.ADV_TABLE).then(function(state){
	var node = state.peek();
	var id = node.data.get('id');
    var text = node.data.get('html') || "<advtable id='"+id+"'></advtable>";
    
    return state.shift().write(text)
});

module.exports = { serialize: serialize };