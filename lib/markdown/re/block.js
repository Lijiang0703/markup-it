'use strict';

/* eslint-disable no-unexpected-multiline, no-spaced-func*/
var _require = require('../utils'),
    replace = _require.replace;

var heading = require('./heading');
var table = require('./table');

var block = {
    newline: /^\n+/,
    code: /^((?: {4}|\t)[^\n]+\n*)+/,
    hr: /^( *[-*_]){3,} *(?:\n|$)/,
    video: /^@[\\]?\[(.*?)[\\]?\][\\]?\((.*?)\)/,
    adv_table: /^@\{table\}\((.+)\)/,
    blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
    custom_html: /^<!--Start-->([\s\S]+?)<!--End-->/,
    html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
    // [someref]: google.com
    def: /^ {0,3}\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n|$)/,
    footnote: /^\[\^([^\]]+)\]: ([^\n]+)/,
    paragraph: /^((?:(?:(?!notParagraphPart)[^\n])+\n?(?!notParagraphNewline))+)\n*/,
    text: /^[^\n]+/,
    fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
    // divBlock:   /^ *(:::{1,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
    // divBlock:   /^ *(:::{1,}|:{3,})\s*[ \.]*(\S+)?\s*(<!--option:\s*\[([\S,\w,\s]+)\] -->)?([\s\S]*?)\s*\1 *(?:\n+|$)/,
    // divBlock:/(^|\n)\s*:::\s*([\-\w]+)\s*(<!--option\s*:\s*\[([\-\w,\s]+)\] -->)?\s*\n(.*\n)*?(\s*:::\s*\n?)/,
    // divBlock:/(^|\n)\s*:::\s*([\-\w]+)\s*(<!--option\s*:\s*\[([\-\w,\s]+)\] -->)?\s*\n([\s\S]*?)(\s*:::\s*\n?)/,
    divBlock: /^ *(:{3,}|:{3,})\s*([\-\w]+)\s*(<!--option\s*:\s*\[([\-\w,\s]+)\] -->)?\s*\n([\s\S]*?)(\s*:::\s*\n?)/,
    yamlHeader: /^ *(?=```)/,
    math: /^ *(\${2,}) *(\n+[\s\S]+?)\s*\1 *(?:\n|$)/,
    list: {
        block: /^( *)(bullet) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1allbull )\n*|\s*$)/,
        item: /^( *)(bullet) [^\n]*(?:\n(?!\1allbull )[^\n]*)*/,
        bullet: /(?:[*+-]|\d+\.)/,
        bullet_ul: /(?:\d+\.)/,
        bullet_ol: /(?:[*+-])/,
        checkbox: /^\[([ x])\] +/,
        bulletAndSpaces: /^ *([*+-]|\d+\.) +/
    },
    customBlock: /^{% *(.*?) *(?=[#%}]})%}/,
    comment: /^{#\s*(.*?)\s*(?=[#%}]})#}/
};

// Any string matching these inside a line will marks the end of the current paragraph
var notParagraphPart = 'customBlock|video';
// Any line starting with these marks the end of the previous paragraph.
var notParagraphNewline = 'hr|heading|lheading|blockquote|tag|def|math|comment|customBlock|table|tablenp|fences|ol';

var _tag = '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|divBlock' + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:\\/|[^\\w\\s@]*@)\\b';

block.list.item = replace(block.list.item, 'gm')(/allbull/g, block.list.bullet)(/bullet/g, block.list.bullet)();

block.blockquote = replace(block.blockquote)('def', block.def)();

block.list.block = replace(block.list.block)(/allbull/g, block.list.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')('footnote', block.footnote)();

block.list.block_ul = replace(block.list.block)(/bullet/g, block.list.bullet_ul)();

block.list.block_ol = replace(block.list.block)(/bullet/g, block.list.bullet_ol)();
block.list.block = replace(block.list.block)(/bullet/g, block.list.bullet)();

block.html = replace(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, _tag)();

block.paragraph = replace(block.paragraph)('notParagraphPart', notParagraphPart)('notParagraphNewline', notParagraphNewline)('hr', block.hr)('video', block.video)('heading', heading.normal)('lheading', heading.line)('blockquote', block.blockquote)('tag', '<' + _tag)('def', block.def)('math', block.math)('customBlock', block.customBlock)('comment', block.comment)('table', table.normal)('tablenp', table.nptable)('fences', block.fences.source.replace('\\1', '\\2'))('ol', block.list.block_ol.source.replace('\\1', '\\3'))();

module.exports = block;