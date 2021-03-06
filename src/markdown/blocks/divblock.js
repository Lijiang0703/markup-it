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



const { Serializer, Deserializer, Block, BLOCKS } = require('../../');
const immutable = require('immutable');
const List = immutable.List;
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
        var className = utils.escape(data.get('class', ''));
        var syntaxes = data.get("syntaxes", "");
        // var syntaxesJSON = syntaxes?syntaxes.toJSON():null
				var syntaxesJSON = syntaxes ? syntaxes : null;
        // console.log('===serialize======',syntaxesJSON)
        var ids = [className];
        var options = ""
        if(syntaxesJSON){
            ids = [];
            for(var i=0;i<syntaxesJSON.length;i++){
                ids.push(syntaxesJSON[i].id)
            }

        }
        options = " <!--option:["+ids.join(",")+"] -->"

        var inner = state.use('block').serialize(node.nodes);
        // Get inner content and number of fences
        // const innerText = nodes
        //     .map(line => line.text)
        //     .join('\n');
        // var  hasFences = innerText.indexOf(':::') >= 0;

        var output;
        output = '::: ' + (Boolean(className) ? className : '') + options + '\n' + (inner + '\n') + (':::' + '\n\n');


        return state
        .shift()
        .write(output);

        // // Use fences if syntax is set
        // if (!hasFences || className) {
        //     output = `${'::: '}${Boolean(className) ? className : ''}\n` +
        //              `${inner}\n` +
        //              `${':::'}\n\n`;

        //     return state
        //         .shift()
        //         .write(output);
        // }

        // output = nodes
        //     .map(({ text }) => {
        //         if (!text.trim()) {
        //             return '';
        //         }
        //         return '    ' + text;
        //     })
        //     .join('\n') + '\n\n';

        // return state
        //     .shift()
        //     .write(output);
    });

/**
 * Deserialize a code block to a node.
 * @type {Deserializer}
 */
// var deserializeFences = Deserializer()
//     .matchRegExp(reBlock.divBlock, function(state, match){

//         // Extract code block text, and trim empty lines
//         var text = trimNewlines(match[3]);

//         // Extract language syntax
//         var data;
//         if (Boolean(match[2])) {
//             data = {
//                 class: utils.unescape(match[2].trim())
//             };
//         }

//         // Split lines
//         // const nodes = deserializeDivBlockLines(text);

//         // const nodes =  List([ state.genText() ])
//         // debugger;
//         var nodes = state.use('block').deserialize(text);
//         var node = Block.create({
//             type: BLOCKS.DIVBLOCK,
//             nodes,
//             data
//         });

//         return state.push(node);
//     });
var deserializeFences = Deserializer()
    .matchRegExp(reBlock.divBlock, function(state, match){
        // console.log(match)
        // Extract code block text, and trim empty lines
        var _text = match[5];
        var _class = match[2].trim();
        let data = {};

        if(match[4]&&match[3]){
            var arr = match[4].trim().split(",");
            var newObj = []
            for(var i=0;i<arr.length;i++){
                newObj.push({
                    id:arr[i].trim(),
                    title:arr[i].trim()

                })
            }
            // var SYNTAXES = immutable.fromJS(newObj);
 						var SYNTAXES = newObj;
            data["syntaxes"]=SYNTAXES ;
        }else{
            // var SYNTAXES = immutable.fromJS([{
            //     id:utils.unescape(_class),
            //     title:utils.unescape(_class)
						//
            // }]);
						var SYNTAXES = [{
                id:utils.unescape(_class),
                title:utils.unescape(_class)

            }];
            data["syntaxes"]=SYNTAXES ;
        }
        if (Boolean(match[2])) {
            data["class"]=utils.unescape(_class);

        }
        // console.log(data)
        const text = trimNewlines(_text);

        // Extract language syntax




        // Split lines
        // const nodes = deserializeDivBlockLines(text);

        // const nodes =  List([ state.genText() ])
        // debugger;
        // const nodes = state.use('block').setPsetProp('divblock',true).deserialize(text);
        var nodes = state.use('block')
        // Signal to children that we are in a blockquote
        .setProp('divblock', state.depth).deserialize(text);

        const node = Block.create({
            type: BLOCKS.DIVBLOCK,
            nodes,
            data
        });
        // state.setPsetProp('divblock',true);
        return state.push(node);
    });


var deserialize = Deserializer()
    .use([
        deserializeFences
        // ,
        // deserializeTabs
    ]);

module.exports = { serialize: serialize, deserialize: deserialize };
