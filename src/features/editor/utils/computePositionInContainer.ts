export interface FloatingMenuCoords {
  x: number;
  y: number;
}

export function computePositionInContainer(
  range: Range,
  floatingEl: HTMLElement,
  container: HTMLElement,
  offset = 10
): FloatingMenuCoords {
  const rangeRect = range.getBoundingClientRect();
  const floatingRect = floatingEl.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x:
      rangeRect.left -
      containerRect.left +
      rangeRect.width / 2 -
      floatingRect.width / 2,

    y:
      rangeRect.top -
      containerRect.top -
      floatingRect.height -
      offset +
      container.scrollTop,
  };
}
