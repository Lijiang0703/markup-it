'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Mark = _require.Mark,
    MARKS = _require.MARKS;

var reInline = require('../re/inline');
var utils = require('../utils');

/**
 * Serialize a italic text to markdown
 * @type {Serializer}
 */
var serialize = Serializer().transformMarkedLeaf(MARKS.ITALIC, function (state, text) {
    return utils.wrapInline(text, '_');
});

/**
 * Deserialize an italic.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reInline.em, function (state, match) {
    var text = match[2] || match[1];
    var mark = Mark.create({ type: MARKS.ITALIC });

    var nodes = state.pushMark(mark).deserialize(text);

    return state.push(nodes);
});

module.exports = { serialize: serialize, deserialize: deserialize };