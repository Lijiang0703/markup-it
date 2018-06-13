'use strict';

var ltrim = require('ltrim');
var rtrim = require('rtrim');

var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Inline = _require.Inline,
    INLINES = _require.INLINES;

var reInline = require('../re/inline');

/**
 * Normalize some TeX content
 * @param {String} content
 * @return {String}
 */
function normalizeTeX(content) {
    content = ltrim(content, '\n');
    content = rtrim(content, '\n');

    return content;
}

/**
 * Serialize a math node to markdown
 * @type {Serializer}
 */
var serialize = Serializer().matchType(INLINES.MATH).then(function (state) {
    var node = state.peek();
    var data = node.data;

    var formula = data.get('formula');

    formula = normalizeTeX(formula);

    var output = '$$' + formula + '$$';

    return state.shift().write(output);
});

/**
 * Deserialize a math
 * @type {Deserializer}
 */
var deserialize = Deserializer().matchRegExp(reInline.math, function (state, match) {
    var formula = match[1].trim();

    if (state.getProp('math') === false || !formula) {
        return;
    }

    var node = Inline.create({
        type: INLINES.MATH,
        isVoid: true,
        data: {
            formula: formula
        }
    });

    return state.push(node);
});

module.exports = { serialize: serialize, deserialize: deserialize };