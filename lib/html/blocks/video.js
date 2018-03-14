'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

var serializeTag = require('../serializeTag');

/**
 * Serialize an horizontal rule to HTML
 * @type {Serializer}
 */
var serialize = Serializer().matchType(BLOCKS.VIDEO).then(()=>{
	var embed = node.data.get('embed');
	var tag = embed ? 'iframe' : 'video';
	serializeTag(tag, {
    getAttrs: function getAttrs(node) {
        return {
            src: node.data.get('src')
        };
    }
})}
	);

module.exports = { serialize: serialize };