const mouseEventOf = (eventType) => (element, x, y) => {
  const rect = element.getBoundingClientRect()

  const event = new MouseEvent(eventType, {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: rect.left + x,
    clientY: rect.top + y,
  })
  element.dispatchEvent(event)
}

function clickOnElement(element, x, y) {
  mouseEventOf('click')(element, x, y)
}

function hoverOnElement(element, x, y) {
  mouseEventOf('mousemove')(element, x, y)
  mouseEventOf('mouseover')(element, x, y)
}

export default {clickOnElement, hoverOnElement}