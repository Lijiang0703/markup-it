'use strict';

var Slate = require('slate');
var detectNewLine = require('detect-newline');
var htmlparser = require('htmlparser2');
var htmlclean = require('htmlclean');

var _require = require('immutable'),
    List = _require.List,
    Stack = _require.Stack,
    Set = _require.Set;

var _require2 = require('slate'),
    Document = _require2.Document;

var _require3 = require('../'),
    BLOCKS = _require3.BLOCKS,
    INLINES = _require3.INLINES,
    MARKS = _require3.MARKS,
    CONTAINERS = _require3.CONTAINERS,
    VOID = _require3.VOID,
    LEAFS = _require3.LEAFS,
    Block = _require3.Block,
    Inline = _require3.Inline,
    Text = _require3.Text,
    Mark = _require3.Mark;

var INLINE_TAGS = {
    a: INLINES.LINK,
    img: INLINES.IMAGE
};

var BLOCK_TAGS = {
    h1: BLOCKS.HEADING_1,
    h2: BLOCKS.HEADING_2,
    h3: BLOCKS.HEADING_3,
    h4: BLOCKS.HEADING_4,
    h5: BLOCKS.HEADING_5,
    h6: BLOCKS.HEADING_6,
    pre: BLOCKS.CODE,
    blockquote: BLOCKS.BLOCKQUOTE,
    p: BLOCKS.PARAGRAPH,
    hr: BLOCKS.HR,
    video: BLOCKS.video,

    table: BLOCKS.TABLE,
    tr: BLOCKS.TABLE_ROW,
    th: BLOCKS.TABLE_CELL,
    td: BLOCKS.TABLE_CELL,

    ul: BLOCKS.UL_LIST,
    ol: BLOCKS.OL_LIST,
    li: BLOCKS.LIST_ITEM,

    advtable: Block.ADV_TABLE
};

var MARK_TAGS = {
    b: MARKS.BOLD,
    strong: MARKS.BOLD,
    del: MARKS.STRIKETHROUGH,
    em: MARKS.ITALIC,
    code: MARKS.CODE
};

var MARK_CLASSNAME = {
    // Use by asciidoc instead of del
    'line-through': MARKS.STRIKETHROUGH
};

var TAGS_TO_DATA = {
    a: function a(attribs) {
        return {
            href: attribs.href,
            title: attribs.alt || ''
        };
    },
    img: function img(attribs) {
        return {
            src: attribs.src,
            title: attribs.alt || ''
        };
    },
    video : function video(attribs){
        return {
            src: attribs.src
        }
    },
    advtable: function advtable(attribs){
        return {
            id: attribs.id
        }
    },

    h1: resolveHeadingAttrs,
    h2: resolveHeadingAttrs,
    h3: resolveHeadingAttrs,
    h4: resolveHeadingAttrs,
    h5: resolveHeadingAttrs,
    h6: resolveHeadingAttrs
};

var SCHEMA_NO_EXTRA_TEXT1 = {
    rules: [

    /**
     * Remove empty text nodes, except if they are only child. Copied from slate's
     */
    {
        match: function match(object) {
            return object.kind == 'block' || object.kind == 'inline';
        },
        validate: function validate(node) {
            var nodes = node.nodes;

            if (nodes.size <= 1) return;

            var invalids = nodes.filter(function (desc, i) {
                if (desc.kind != 'text') return;
                if (desc.text.length > 0) return;
                return true;
            });

            return invalids.size ? invalids : null;
        },
        normalize: function normalize(change, node, invalids) {
            // Reverse the list to handle consecutive merges, since the earlier nodes
            // will always exist after each merge.
            invalids.forEach(function (n) {
                change.removeNodeByKey(n.key, { normalize: false });
            });
        }
    }]
};
var SCHEMA_NO_EXTRA_TEXT = {
    schema: {},
    validateNode: function validateNode(node) {
        if (node.kind != 'block' || object.kind != 'inline') return;
        var invalids = node.nodes.filter(function (n) {
            if (n.kind != 'text') return;
            if (n.text.length > 0) return;
            return true;
        });
        if (!invalids.size) return;
        return function (change) {
            invalids.forEach(function (child) {
                change.removeNodeByKey(child.key, { normalize: false });
            });
        };
    }

};
function resolveHeadingAttrs(attribs) {
    return attribs.id ? { id: attribs.id } : {};
}

/**
 * Flatten a block node into a list of inline nodes.
 * @param  {Node} node
 * @return {List<Node>} nodes
 */
function selectInlines(node) {
    if (node.kind !== 'block') {
        return List([node]);
    }

    var nodes = node.nodes;

    return nodes.reduce(function (result, child) {
        return result.concat(selectInlines(child));
    }, List());
}

/**
 * Get all marks from a class name.
 * @param {String} className
 * @return {Array<Mark>}
 */
function getMarksForClassName(className) {
    className = className || '';
    var classNames = className.split(' ');
    var result = [];

    classNames.forEach(function (name) {
        var type = MARK_CLASSNAME[name];
        if (!type) {
            return;
        }

        var mark = Mark.create({
            type: type
        });
        result.push(mark);
    });

    return result;
}

/**
 * Returns the accepted block types for the given container
 */
function acceptedBlocks(container) {
    return CONTAINERS[container.type || container.kind];
}

/**
 * True if the node is a block container node
 */
function isBlockContainer(node) {
    return Boolean(acceptedBlocks(node));
}

/**
 * Returns the default block type for a block container
 */
function defaultBlockType(container) {
    return acceptedBlocks(container)[0];
}

/**
 * True if `block` can contain `node`
 */
function canContain(block, node) {
    if (node.kind === 'inline' || node.kind === 'text') {
        return LEAFS[block.type];
    } else {
        var types = acceptedBlocks(block);
        return types && types.indexOf(node.type) !== -1;
    }
}

/*
 * sanitizeSpaces replace non-breaking spaces with regular space
 * non-breaking spaces (aka &nbsp;) are sources of many problems & quirks
 * &nbsp; in ascii is `0xA0` or `0xC2A0` in utf8
 * @param {String} str
 * @return {String}
 */
function sanitizeSpaces(str) {
    return str.replace(/\xa0/g, ' ');
}

/**
 * @param {String} tagName The tag name
 * @param {Object} attrs The tag's attributes
 * @return {Object} data
 */
function getData(tagName, attrs) {
    return (TAGS_TO_DATA[tagName] || function () {})(attrs);
}

/**
 * @param {String} nodeType
 * @return {Boolean} isVoid
 */
function isVoid(nodeType) {
    return Boolean(VOID[nodeType]);
}

/**
 * Returns the list of lines in the string
 * @param {String} text
 * @param {String} sep?
 * @return {List<String>}
 */
function splitLines(text, sep) {
    sep = sep || detectNewLine(text) || '\n';
    return List(text.split(sep));
}

/**
 * Deserialize an HTML string
 * @param {Document} document
 * @return {Document}
 */
function removeExtraEmptyText1(document) {
    var slateState = Slate.State.fromJSON({
        document: document
    }, {
        normalize: false
    });

    // Remove first extra empty text nodes, since for now HTML introduces a lot of them
    var noExtraEmptyText = slateState.change().normalize(Slate.Schema.create(SCHEMA_NO_EXTRA_TEXT)).state;
    // Then normalize it using Slate's core schema.
    var normalizedState = Slate.State.fromJSON(noExtraEmptyText.toJSON());

    return normalizedState.document;
}

function removeExtraEmptyText(document) {
    var slateState = Slate.Value.fromJSON({
        document: document
    }, {
        normalize: false
    });

    // Remove first extra empty text nodes, since for now HTML introduces a lot of them
    // var noExtraEmptyText = slateState.change().normalize(Slate.Schema.create(SCHEMA_NO_EXTRA_TEXT)).state;
    var noExtraEmptyText = slateState.change().normalize(Slate.Schema.create({ plugins: [SCHEMA_NO_EXTRA_TEXT] })).value;
    // Then normalize it using Slate's core schema.
    var normalizedState = Slate.Value.fromJSON(noExtraEmptyText.toJSON());

    return normalizedState.document;
}

/**
 * Parse an HTML string into a document
 * @param {String} str
 * @return {Document}
 */
function parse(str) {
    // Cleanup whitespaces
    str = htmlclean(str);

    // For convenience, starts with a root node
    var root = Document.create({});
    // The top of the stack always hold the current parent
    // node. Should never be empty.
    var stack = Stack().push(root);
    // The current marks
    var marks = Set();

    // Update the node on top of the stack with the given node
    function setNode(node) {
        stack = stack.pop().push(node);
    }

    // Append a node child to the current parent node
    function appendNode(node) {
        var parent = stack.peek();
        var nodes = parent.nodes;

        // If parent is not a block container

        if (!isBlockContainer(parent) && node.kind == 'block') {
            // Discard all blocks
            nodes = nodes.concat(selectInlines(node));
        }

        // Wrap node if type is not allowed
        else if (isBlockContainer(parent) && (node.kind !== 'block' || !canContain(parent, node))) {
                var previous = parent.nodes.last();
                if (previous && canContain(previous, node)) {
                    // Reuse previous block if possible
                    nodes = nodes.pop().push(previous.set('nodes', previous.nodes.push(node)));
                } else {
                    // Else insert a default wrapper
                    node = Block.create({
                        type: defaultBlockType(parent),
                        nodes: [node]
                    });

                    nodes = nodes.push(node);
                }
            } else {
                nodes = nodes.push(node);
            }

        setNode(parent.merge({ nodes: nodes }));
    }

    // Push a new node, as current parent. We started parsing it
    function pushNode(node) {
        stack = stack.push(node);
    }

    // Pop the current parent node. Because we're done parsing it
    function popNode() {
        var node = stack.peek();
        stack = stack.pop();
        appendNode(node);
    }

    var parser = new htmlparser.Parser({
        onopentag: function onopentag(tagName, attribs) {
            if (BLOCK_TAGS[tagName]) {
                var type = BLOCK_TAGS[tagName];
                var block = Block.create({
                    data: getData(tagName, attribs),
                    isVoid: isVoid(type),
                    type: type
                });

                pushNode(block);
            } else if (INLINE_TAGS[tagName]) {
                var _type = INLINE_TAGS[tagName];
                var inline = Inline.create({
                    data: getData(tagName, attribs),
                    isVoid: isVoid(_type),
                    type: _type
                });

                pushNode(inline);
            } else if (MARK_TAGS[tagName]) {
                var mark = Mark.create({
                    data: getData(tagName, attribs),
                    type: MARK_TAGS[tagName]
                });

                marks = marks.add(mark);
            } else if (tagName == 'br') {
                var textNode = Text.create({
                    text: '\n',
                    marks: marks
                });
                appendNode(textNode);
            }
            // else ignore

            // Parse marks from the class name
            var newMarks = getMarksForClassName(attribs['class']);
            marks = marks.concat(newMarks);
        },
        ontext: function ontext(text) {
            var cleanText = sanitizeSpaces(text);
            var textNode = Text.create({ text: cleanText, marks: marks });
            appendNode(textNode);
        },
        onclosetag: function onclosetag(tagName) {
            if (BLOCK_TAGS[tagName] || INLINE_TAGS[tagName]) {
                var parent = stack.peek();

                // Special rule for code blocks that we must split in lines
                if (parent.type === BLOCKS.CODE) {
                    var lines = splitLines(parent.text);
                    // Remove trailing newline
                    if (lines.last().trim() === '') {
                        lines = lines.skipLast(1);
                    }
                    setNode(parent.merge({
                        nodes: lines.map(function (line) {
                            // Create a code line
                            return Block.create({
                                type: BLOCKS.CODE_LINE,
                                nodes: [Text.create(line)]
                            });
                        })
                    }));
                }

                popNode();
            } else if (MARK_TAGS[tagName]) {
                (function () {
                    var type = MARK_TAGS[tagName];
                    marks = marks.filter(function (mark) {
                        return mark.type !== type;
                    });
                })();
            }
            // else ignore
        }
    }, {
        decodeEntities: true
    });

    parser.write(str);
    parser.end();

    if (stack.size !== 1) {
        throw new Error('Invalid HTML. A tag might not have been closed correctly.');
    }

    return removeExtraEmptyText(stack.peek());
}

module.exports = parse;