'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize a tab to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.TAB_LIST).then(function (state) {
    var node = state.peek();
    var nodes = node.nodes;
    var inner = state.serialize(nodes);

    var list = nodes.map(function (inode) {
        if (inode.type === "tabs-item") {
            var data = inode.data;
            return '<li role="presentation"><a href="#' + data.get('id') + '" role="tab" data-toggle="tab">' + data.get('title') + '</a></li>';
        }
    }).join('');

    var str = '<div><ul class="nav nav-tabs" role="tablist">' + list + '</ul><div class="tab-content">' + inner + '</div></div>';

    return state.shift().write(str);
});

module.exports = { serialize: serialize };