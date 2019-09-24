import { findFirstEmptyPosition } from '../../../src/utils/addCameraToPane'

// Test for Adding Camera Pane
describe('Add Camera Pane', () => {
  // Empty Grid Should Return Starting Camera Position
  it('Add to Empty Camera Grid', () => {
    const currentGrid = []
    expect(findFirstEmptyPosition(currentGrid)).toEqual({ x: 0, y: 0, w: 1, h: 1 })
  })

  // Grid with One Camera Should Return New Camera Position
  it('Add to Single Camera in Grid', () => {
    const currentGrid = [
      {
        id: 'box-a',
        position: { x: 5, y: 5, w: 7, h: 4 }
      }
    ]
    expect(findFirstEmptyPosition(currentGrid)).toEqual({ x: 0, y: 0, w: 1, h: 1 })
  })

  // Grid with Multiple Cameras
  it('Add to Multiple Cameras in Grid', () => {
    const currentGrid = [
      {
        id: 'box-a',
        position: { x: 0, y: 0, w: 2, h: 2 }
      },
      {
        id: 'box-b',
        position: { x: 3, y: 1, w: 5, h: 5 }
      },
      {
        id: 'box-c',
        position: { x: 11, y: 1, w: 1, h: 12 }
      },
      {
        id: 'box-d',
        position: { x: 11, y: 5, w: 1, h: 1 }
      }
    ]
    expect(findFirstEmptyPosition(currentGrid)).toEqual({ x: 2, y: 0, w: 1, h: 1 })
  })

  // Full Grid Should Return 0
  it('Add to Full Camera Grid', () => {
    const currentGrid = [
      {
        id: 'box-a',
        position: { x: 0, y: 0, w: 12, h: 12 }
      }
    ]
    expect(findFirstEmptyPosition(currentGrid)).toEqual(0)
  })
})
