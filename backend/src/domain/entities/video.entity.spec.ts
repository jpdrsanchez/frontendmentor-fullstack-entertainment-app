import { videoFactory } from '@test/factories/video.factory'
import { Video } from './video.entity'

describe('Video Domain Entity', () => {
  it('should be able to create a new video', async () => {
    const video = await videoFactory()

    expect(video).toBeTruthy()
    expect(video).toBeInstanceOf(Video)
  })
})
