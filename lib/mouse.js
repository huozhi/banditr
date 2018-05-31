export const mouseEventOf = (eventType) => (element, x, y) => {
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
