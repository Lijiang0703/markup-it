const { Serializer, Deserializer, BLOCKS } = require('../');
const parse = require('./parse');
const {uuid} = require('../utils/escape')
const {Map} = require('immutable')
/**
 * Serialize a document to HTML.
 * @type {Serializer}
 */
const serialize = Serializer()
    .matchObject('document')
    .then((state) => {
        const node = state.peek();
        // const { nodes } = node;
        //为toc作处理，把header数据放在toc的子元素中
        const nodes = getToc(node.nodes);
        const text = state
            .use('block')
            .serialize(nodes);

        return state
            .shift()
            .write(text);
    });

/**
 * Deserialize an HTML document.
 * @type {Deserializer}
 */
const deserialize = Deserializer()
    .then((state) => {
        const { text } = state;
        const document = parse(text);

        return state
            .skip(text.length)
            .push(document);
    });
function getToc(nodes){
  const data = getHeader(nodes,{})
  const header = data.result.header
  nodes = data.nodes
  const html = createDocHTML(header)

  return nodes.map(function(n){
    if(n.type === 'toc'){
      return n.set('data',Map({html: html}))
    }
    return n ;
  })
}
//获取header数据
//header不会嵌套，find到就结束当前树
const HEAD = [BLOCKS.HEADING_1,
              BLOCKS.HEADING_2,
              BLOCKS.HEADING_3,
              BLOCKS.HEADING_4,
              BLOCKS.HEADING_5,
              BLOCKS.HEADING_6]

function getHeader(nodes,result) {
  // let nodes = data.nodes

  nodes = nodes.map(function(node){
    let type = node.type;
    let index = HEAD.indexOf(type)

    if(index!= -1){ //找到
      //如果header没有id，则需要添加默认的id
      if(node.data == undefined || node.data.get('id') == undefined){
        node = node.set('data',Map({
          id: uuid(4)
        }))
      }
      result = addHeader(node,index+1,result)
    } else if(node.kind == "block"){ //继续遍历子节点,需要判断哪些元素需要继续遍历，提高效率
      let header = getHeader(node.nodes,result)
      result = header.result
      node = node.set('nodes',header.nodes)
    }
    return node
  })
  // for(let i=0;i<nodes.size;i++){
  //   let node = nodes._tail.array[i]
  //   let type = node.type;
  //   let index = HEAD.indexOf(type)
  //
  //   if(index!= -1){ //找到
  //     //如果header没有id，则需要添加默认的id
  //     if(node.data.get('id') == undefined){
  //       node = node.set('data',{
  //         id: uuid(4)
  //       })
  //     }
  //     result = addHeader(node,index+1,result)
  //   } else if(node.kind == "block"){ //继续遍历子节点,需要判断哪些元素需要继续遍历，提高效率
  //     result = getHeader(node.nodes,result)
  //   }
  // }
  return {
    result : result,
    nodes: nodes
  }
}
function addHeader(node,type,result){ //直接生成html
  // let header = result.header;  //平行结构
  // let last = header[header.length-1]
  // let type = last.type;
  if(!result.header) result.header = []

  // if(type < node.type){ //child
    // last.child.push({
    //
    // })
  // }else{ //new 行
  const id = node.data.id || node.data.get('id')
    result.header.push({
      type: type,
      html: `<a href='#${id}'>${node.text}</a>`
    })
  // }
  return result
}

function createDocHTML(headers){ //根据获取到的数据生成完整的html
  if(!headers) return ""
  let html= ""  //返回的结果
  let l= 0 //纪录需要移除的数据长度
  let closeTagStack= [] //需要关闭的标签栈,采用后进先出的规则
  let typeStack = []  //类型栈,初始包含h1

  html += "<ul class='noHashScroll toc'>"
  for(let i=0;i <headers.length; i++){
    let header = headers[i]
    let type = header.type
    let index = typeStack.indexOf(type)
    if(typeStack.length === 0){
      typeStack.push(type)
      html+= "<li>" + header.html
      closeTagStack.push("</li>")
      continue;
    }
    if(index === -1){
      if(type > typeStack[0]){ //小于当前最小type
        typeStack.unshift(type)
        //这时候需要把closetag的第一个标签变成 </ul>
        html += "<ul>" + "<li>" + header.html
        closeTagStack[0]= "</ul>"+ closeTagStack[0]
        closeTagStack.unshift("</li>")
        //头上咋办呢
      }else if(type < typeStack[typeStack.length-1]){ //大于最大type
        //这时需要清空目前的标签栈 并且清空类型栈
        html += closeTagStack.splice(0).join('') + "<li>" + header.html
        typeStack.splice(0)
        //同时创建新的栈
        typeStack.unshift(type)
        closeTagStack.unshift('</li>')
      }else{ //应该在中间位置,这时候需要关闭中间位置以前的tag标签，同时把type栈内的也清除
        //找到位置 ???
        let current = max(typeStack,type)  //小于当前类型的最大位置
        html += closeTagStack.splice(0,current+1).join('') + "<li>"+ header.html
        typeStack.splice(0,current+1,type)
        closeTagStack.unshift('</li>')
      }
    }else { //在堆栈里有位置，则说明有并列的标题，这时需要关闭并列标题后的所有标签 ，添加自己的html，直到有不在堆栈并且大于堆栈里所有的值时，清空tag堆栈
      let closeTags = closeTagStack.splice(0,i+1).join('')
      typeStack.splice(0,i)
      html += closeTags + "<li>" + header.html
      closeTagStack.unshift('</li>')
    }
  }
  html += closeTagStack.splice(0).join('') + "</ul>"
  // html +="</tag>"
  return html
}

function max(arr,d){
  let max;
  for(let i =0;i<arr.length;i++){
    if(arr[i] > d && arr[i+1]<d){
      max = i
      break;
    }
  }
  return max;
}
module.exports = { serialize, deserialize };
