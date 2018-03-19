'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var serializeTag = require('../serializeTag');

/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.VIDEO).then(function(state){
	var node = state.peek();
    var embed = node.data.get('embed');
	var tag = embed ? 'iframe' : 'video';

    var text = "<"+ tag + " src='"+node.data.get('src')+"'></"+tag+">";
    return state.shift().write(text)
});

module.exports = { serialize: serialize };