import { viewerFactory } from '@test/factories/viewer.factory'
import { Viewer } from './viewer.entity'

describe('Viewer Domain Entity', () => {
  it('should be able to create a new viewer', async () => {
    const viewer = await viewerFactory()

    expect(viewer).toBeTruthy()
    expect(viewer).toBeInstanceOf(Viewer)
  })
})
