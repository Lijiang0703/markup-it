'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    MARKS = _require.MARKS;

/**
 * Serialize a italic text to HTML
 * @type {Serializer}
 */


var serialize = Serializer().transformMarkedRange(MARKS.ITALIC, function (state, text, mark) {
    return '<em>' + text + '</em>';
});

module.exports = { serialize: serialize };