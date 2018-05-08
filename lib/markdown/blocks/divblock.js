// const { List } = require('immutable');
// const trimNewlines = require('trim-newlines');

// const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
// const deserializeCodeLines = require('../../utils/deserializeCodeLines');
// const deserializeDivBlockLines = require('../../utils/deserializeDivBlockLines');


// const reBlock = require('../re/block');
// const utils = require('../utils');




var trimNewlines=function (x) {
	return trimNewlines.end(trimNewlines.start(x));
};

trimNewlines.start = function (x) {
	return x.replace(/^[\r\n]+/, '');
};

trimNewlines.end = function (x) {
	return x.replace(/[\r\n]+$/, '');
};



var _require = require('../../'),
    Serializer = _require.Serializer,
    Deserializer = _require.Deserializer,
    Block = _require.Block,
    BLOCKS = _require.BLOCKS;
var immu = require('immutable'),
List = immu.List;

// var  deserializeDivBlockLines = require('../../utils/deserializeDivBlockLines');

var utils = require('../utils');
var reBlock = require('../re/block');



/**
 * Serialize a code block to markdown
 * @type {Serializer}
 */
var serialize = Serializer()
    .matchType(BLOCKS.DIVBLOCK)
    .then(function(state){
        var node = state.peek();
        var nodes = node.nodes;
        var data = node.data;
        
        // const { nodes, data } = node;

        // Escape the syntax
        // http://spec.commonmark.org/0.15/#example-234
        var className = utils.escape(data.get('class') || '');
        var inner = state.use('inline').serialize(node.nodes);
        // Get inner content and number of fences
        const innerText = nodes
            .map(line => line.text)
            .join('\n');
        var  hasFences = innerText.indexOf(':::') >= 0;

        var  output;

        // Use fences if syntax is set
        if (!hasFences || className) {
            output = `${'::: '}${Boolean(className) ? className : ''}\n` +
                     `${inner}\n` +
                     `${':::'}\n\n`;

            return state
                .shift()
                .write(output);
        }

        output = nodes
            .map(({ text }) => {
                if (!text.trim()) {
                    return '';
                }
                return '    ' + text;
            })
            .join('\n') + '\n\n';

        return state
            .shift()
            .write(output);
    });

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
var deserializeFences = Deserializer()
    .matchRegExp(reBlock.divBlock, function(state, match){
      
        // Extract code block text, and trim empty lines
        const text = trimNewlines(match[3]);

        // Extract language syntax
        let data;
        if (Boolean(match[2])) {
            data = {
                class: utils.unescape(match[2].trim())
            };
        }

        // Split lines
        // const nodes = deserializeDivBlockLines(text);

        // const nodes =  List([ state.genText() ])
        const nodes = state.use('inline').deserialize(text);
        const node = Block.create({
            type: BLOCKS.DIVBLOCK,
            nodes,
            data
        });

        return state.push(node);
    });



var deserialize = Deserializer()
    .use([
        deserializeFences
        // ,
        // deserializeTabs
    ]);

module.exports = { serialize: serialize, deserialize: deserialize };