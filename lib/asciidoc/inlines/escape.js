'use strict';

var entities = require('html-entities');

var _require = require('immutable'),
    Map = _require.Map;

var _require2 = require('../../'),
    Serializer = _require2.Serializer,
    MARKS = _require2.MARKS;

var _require3 = require('../../utils/escape'),
    escapeWith = _require3.escapeWith;

var xmlEntities = new entities.XmlEntities();

// Replacements for Asciidoc escaping
var REPLACEMENTS = Map([['*', '\\*'], ['#', '\\#'], ['(', '\\('], [')', '\\)'], ['[', '\\['], [']', '\\]'], ['`', '\\`'], ['<', '&lt;'], ['>', '&gt;'], ['_', '\\_'], ['|', '\\|'], ['{', '\\{'], ['}', '\\}']]);

/**
 * Escape a string to asciidoc.
 * @param {String} text
 * @return {String}
 */
function escape(text) {
    text = escapeWith(REPLACEMENTS, text);
    return xmlEntities.encode(text);
}

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
        text: hasCode ? text : escape(text, false)
    });
});

module.exports = { serialize: serialize };