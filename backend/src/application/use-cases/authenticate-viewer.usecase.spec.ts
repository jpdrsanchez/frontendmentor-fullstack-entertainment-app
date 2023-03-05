import { Password } from '@domain/entities/value-objects/password'
import { Viewer } from '@domain/entities/viewer.entity'
import { ViewersRepository } from '@domain/repositories/viewers.repository'
import { viewerFactory } from '@test/factories/viewer.factory'
import { InMemoryViewersRepository } from '@test/repositories/in-memory-viewers.repository'
import { AuthenticateViewerUseCase } from './authenticate-viewer.usecase'
import { IncorrectCredentialsException } from './exceptions/incorrect-credentials.exception'

describe('AuthenticateViewer Use Case', () => {
  let viewersRepository: ViewersRepository
  let authenticateViewer: AuthenticateViewerUseCase
  let viewer: Viewer
  let plainPassword: string

  beforeEach(async () => {
    plainPassword = 'eY$%eRtYu76'
    const password = await Password.create('eY$%eRtYu76')
    viewersRepository = new InMemoryViewersRepository()
    authenticateViewer = new AuthenticateViewerUseCase(viewersRepository)
    viewer = await viewerFactory({ password: password.value as Password })
  })

  it('should be able to check if the viewer credentials are valid', async () => {
    await viewersRepository.create(viewer)
    const authViewer = await authenticateViewer.execute({
      email: viewer.email,
      password: plainPassword
    })

    expect(authViewer.isRight()).toBe(true)
    expect(authViewer.value).toBeInstanceOf(Viewer)
  })

  it('should be able to throw the same exception when any of the credentials are invalid', async () => {
    await viewersRepository.create(viewer)
    let authViewer = await authenticateViewer.execute({
      email: viewer.email,
      password: '123456'
    })
    expect(authViewer.isLeft()).toBe(true)
    expect(authViewer.value).toBeInstanceOf(IncorrectCredentialsException)

    authViewer = await authenticateViewer.execute({
      email: 'dummy@example.com',
      password: plainPassword
    })
    expect(authViewer.isLeft()).toBe(true)
    expect(authViewer.value).toBeInstanceOf(IncorrectCredentialsException)
  })
})
