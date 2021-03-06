'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    MARKS = _require.MARKS;

/**
 * Serialize a italic text to Asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().transformMarkedRange(MARKS.ITALIC, function (state, text, mark) {
    return '__' + text + '__';
});

module.exports = { serialize: serialize };