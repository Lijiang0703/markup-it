'use strict';

var _require = require('../../'),
    Serializer = _require.Serializer,
    MARKS = _require.MARKS;

var utils = require('../utils');

/**
 * Escape all text ranges during serialization.
 * This step should be done before processing text ranges for marks.
 *
 * @type {Serializer}
 */
var serialize = Serializer().transformText(function (state, range) {
    var text = range.text,
        marks = range.marks;

    var hasCode = marks.some(function (mark) {
        return mark.type === MARKS.CODE;
    });

    return range.merge({
        text: hasCode ? text : utils.escape(text, false)
    });
});

module.exports = { serialize: serialize };