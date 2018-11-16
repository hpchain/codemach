/* eslint-disable */
const drag = (el, params, editorArr) => {
  for (var i = 0; i < editorArr.length; i++) {
    editorArr[i].editor.resize()
  }
  var option = Object.assign({
    direction: 'Y',
    preNode: '.content-first',
    nextNode: '.console',
    parentNode: '.edit-content'
  }, params)
  el.onmousedown=function  (ev) {
    var oEvent = ev || event
    var X = oEvent.clientX
    var Y = oEvent.clientY
    var elTop = (el.style.top.split('%')[0] - 0) / 100
    var parentH = document.querySelector(option.parentNode).offsetHeight
    var preNode = document.querySelector(option.preNode)
    var nextNode = document.querySelector(option.nextNode)
    document.onmousemove=function  (ev) {
      var oEvent = ev || event
      var XX = oEvent.clientX
      var YY = oEvent.clientY
      if (option.direction === 'Y') {
        var offsetY = ((YY - Y) / parentH) + elTop
        el.style.top = offsetY * 100 + '%'
        preNode.style.height = offsetY * 100 + '%'
        nextNode.style.height = (1 - offsetY) * 100 + '%'
      }
      for (var i = 0; i < editorArr.length; i++) {
        editorArr[i].editor.resize()
      }
    }
    document.onmouseup=function  () {
      document.onmousedown=null;
      document.onmousemove=null;
    }
  }
}
export default drag
  