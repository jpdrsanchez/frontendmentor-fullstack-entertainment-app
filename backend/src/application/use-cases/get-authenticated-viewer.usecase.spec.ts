import { Password } from '@domain/entities/value-objects/password'
import { Viewer } from '@domain/entities/viewer.entity'
import { viewerFactory } from '@test/factories/viewer.factory'
import { InMemoryViewersRepository } from '@test/repositories/in-memory-viewers.repository'
import { ViewerNotFoundException } from './exceptions/viewer-not-found.exception'
import { GetAuthenticatedViewerUseCase } from './get-authenticated-viewer.usecase'

describe('GetAuthenticatedViewer Use Case', () => {
  let viewersRepository: InMemoryViewersRepository
  let getAuthenticatedViewer: GetAuthenticatedViewerUseCase
  let viewer: Viewer

  beforeEach(async () => {
    viewersRepository = new InMemoryViewersRepository()
    getAuthenticatedViewer = new GetAuthenticatedViewerUseCase(
      viewersRepository
    )
    viewer = await viewerFactory({
      password: (await Password.create('eY%$6yTuO98')).value as Password
    })
  })

  it('should be able to return a valid authenticated viewer', async () => {
    await viewersRepository.create(viewer)
    const authenticatedViewer = await getAuthenticatedViewer.execute({
      idOrEmail: viewer.email
    })

    expect(authenticatedViewer.isRight()).toBe(true)
    expect(authenticatedViewer.value).toBeInstanceOf(Viewer)
    expect(authenticatedViewer.value).toBe(viewer)
  })

  it('should be able to throw an not found exception when the requested viewer does not exist', async () => {
    const nonExistingViewer = await getAuthenticatedViewer.execute({
      idOrEmail: ''
    })

    expect(nonExistingViewer.isLeft()).toBe(true)
    expect(nonExistingViewer.value).toBeInstanceOf(ViewerNotFoundException)
  })
})
