'use strict';

var _require = require('../'),
    State = _require.State,
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer;

var asciidoctor = require('asciidoctor.js')();
var html = require('../html');

/**
 * Render Asciidoc to HTML.
 * @param  {String} content
 * @return {String} html
 */
function asciidocToHTML(content) {
    return asciidoctor.convert(content, {
        'attributes': 'showtitle'
    });
}

/**
 * Serialize a document to Asciidoc.
 * @type {Serializer}
 */
var serialize = Serializer().matchKind('document').then(function (state) {
    var node = state.peek();
    var nodes = node.nodes;


    var text = state.use('block').serialize(nodes);

    return state.shift().write(text);
});

/**
 * Deserialize an Asciidoc document.
 * @type {Deserializer}
 */
var deserialize = Deserializer().then(function (state) {
    var text = state.text;

    var htmlContent = asciidocToHTML(text);
    var htmlState = State.create(html);

    var document = htmlState.deserializeToDocument(htmlContent);

    return state.push(document).skip(text.length);
});

module.exports = { serialize: serialize, deserialize: deserialize };