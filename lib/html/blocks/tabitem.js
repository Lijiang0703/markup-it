"use strict";

var _require = require('../../'),
    Serializer = _require.Serializer,
    BLOCKS = _require.BLOCKS;

/**
 * Serialize a tab to HTML
 * @type {Serializer}
 */


var serialize = Serializer().matchType(BLOCKS.TAB_ITEM).then(function (state) {
    var node = state.peek();
    var inner = state.serialize(node.nodes);
    var id = node.data.get("id") || "";

    var str = "<div class=\"tab-pane\" role=\"tabpanel\" id=\"" + id + "\">" + inner + "</div>";

    return state.shift().write(str);
});

module.exports = { serialize: serialize };