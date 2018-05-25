const hr = require('./hr');
const video = require('./video');
const heading = require('./heading');
const paragraph = require('./paragraph');
const codeBlock = require('./code');
const divBlock = require('./divBlock');
const blockquote = require('./blockquote');
const unstyled = require('./unstyled');
const footnote = require('./footnote');
const table = require('./table');
const list = require('./list');
const definition = require('./definition');
const math = require('./math');
const comment = require('./comment');
const html = require('./html');
const custom = require('./custom');
const adv_table = require('./advtable');
const custom_html = require('./customhtml');

module.exports = [
    // All link definition (for link reference) must be resolved first.
    definition,
    // HTML must be high in the stack too.
    custom_html,
    html,
    definition,
    table,
    divBlock,
    video,
    adv_table,
    hr,
    list,
    footnote,
    blockquote,
    codeBlock,
    heading,
    math,
    comment,
    custom,
    paragraph,
    unstyled
];
