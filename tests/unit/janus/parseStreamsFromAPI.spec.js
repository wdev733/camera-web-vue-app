import { parseStreams } from '../../../src/plugins/JanusPlugin/JanusVueUtils'

describe('Parse Streams From API', () => {
  // Empty Grid Should Return Starting Camera Position
  it('Parse streams', () => {
    const streams = [
      { ifuId: 1, cameraId: 3 },
      { ifuId: 2, cameraId: 34 },
      { ifuId: 1, cameraId: 4 },
      { ifuId: 2, cameraId: 5 },
      { ifuId: 5, cameraId: 6 }
    ]
    const expected = [
      { ifu: 1, ifuServer: 'https://ifu-1.proxy.agricamera.co.uk/janus' },
      { ifu: 2, ifuServer: 'https://ifu-2.proxy.agricamera.co.uk/janus' },
      { ifu: 5, ifuServer: 'https://ifu-5.proxy.agricamera.co.uk/janus' }
    ]
    expect(parseStreams(streams)).toEqual(expected)
  })
})
