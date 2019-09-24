// Check if positions are colliding
export const positionsAreColliding = (positionA, positionB) => {
  return positionA.x < (positionB.x + positionB.w) &&
    (positionA.x + positionA.w) > positionB.x &&
    positionA.y < (positionB.y + positionB.h) &&
    (positionA.y + positionA.h) > positionB.y
}

// Check if position is free in layout
export const isFree = (position, layout) => {
  for (let i = 0; i < layout.length; i++) {
    if (positionsAreColliding(layout[i].position, position)) {
      return false
    }
  }
  return true
}

// Find First Empty Position
export const findFirstEmptyPosition = (layout) => {
  let position = { x: 0, y: 0, w: 1, h: 1 }
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      position.x = j
      position.y = i
      if (isFree(position, layout)) {
        return position
      }
    }
  }
  return 0
}
