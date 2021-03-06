'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Mark = _require.Mark,
    MARKS = _require.MARKS;

var reInline = require('../re/inline');
var utils = require('../utils');

/**
 * Serialize a bold text to markdown
 * @type {Serializer}
 */
var serialize = Serializer().transformMarkedLeaf(MARKS.BOLD, function (state, text, mark) {
    return utils.wrapInline(text, '**');
});

/**
 * Deserialize a bold.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reInline.strong, function (state, match) {
    var text = match[2] || match[1];
    var mark = Mark.create({ type: MARKS.BOLD });

    var nodes = state.pushMark(mark).deserialize(text);

    return state.push(nodes);
});

module.exports = { serialize: serialize, deserialize: deserialize };