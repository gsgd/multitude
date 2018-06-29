const mouseEvent = function (type, x, y) {
  const e = {
    bubbles: true,
    cancelable: (type !== 'mousemove'),
    view: window,
    detail: 0,
    screenX: x | 0,
    screenY: y | 0,
    clientX: x | 0,
    clientY: y | 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: undefined
  }
  return new window.MouseEvent(type, e)
}

const actions = {
  clickMove: function (el, x, y) {
    el.dispatchEvent(mouseEvent('mousedown', x, y))
    el.dispatchEvent(mouseEvent('mousemove', x, y))
    el.dispatchEvent(mouseEvent('mouseup', x, y))
  }
}
module.exports = actions
