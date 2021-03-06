'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    MARKS = _require.MARKS;

/**
 * Serialize a strikethrough text to Asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().transformMarkedRange(MARKS.STRIKETHROUGH, function (state, text, mark) {
    return '[line-through]#' + text + '#';
});

module.exports = { serialize: serialize };