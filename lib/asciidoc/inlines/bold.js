'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    MARKS = _require.MARKS;

/**
 * Serialize a bold text to Asciidoc
 * @type {Serializer}
 */


var serialize = Serializer().transformMarkedRange(MARKS.BOLD, function (state, text, mark) {
    return '**' + text + '**';
});

module.exports = { serialize: serialize };