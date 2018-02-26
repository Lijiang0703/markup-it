'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    MARKS = _require.MARKS;

/**
 * Serialize a bold text to HTML
 * @type {Serializer}
 */


var serialize = Serializer().transformMarkedRange(MARKS.BOLD, function (state, text, mark) {
    return '<b>' + text + '</b>';
});

module.exports = { serialize: serialize };