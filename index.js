
function clickOnElement(element, x, y) {
  mouseEventOf('click')(element, x, y)
}

function hoverOnElement(element, x, y) {
  mouseEventOf('mousemove')(element, x, y)
  mouseEventOf('mouseover')(element, x, y)
}

export {clickOnElement, hoverOnElement}