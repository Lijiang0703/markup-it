'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Mark = _require.Mark,
    Text = _require.Text,
    MARKS = _require.MARKS;

var reInline = require('../re/inline');
var utils = require('../utils');

/**
 * Serialize a code text to markdown
 * @type {Serializer}
 */
var serialize = Serializer().transformMarkedLeaf(MARKS.CODE, function (state, text, mark) {
    var separator = '`';

    // We need to find the right separator not present in the content
    while (text.indexOf(separator) >= 0) {
        separator += '`';
    }

    return utils.wrapInline(text, separator);
});

/**
 * Deserialize a code.
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reInline.code, function (state, match) {
    var text = match[2];
    var mark = Mark.create({ type: MARKS.CODE });

    var node = Text.create({ text: text, marks: [mark] });
    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };