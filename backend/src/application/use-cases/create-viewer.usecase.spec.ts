import { InvalidEmailException } from '@domain/entities/value-objects/exceptions/invalid-email.exception'
import { InvalidNameException } from '@domain/entities/value-objects/exceptions/invalid-name.exception'
import { InvalidPasswordException } from '@domain/entities/value-objects/exceptions/invalid-password.exception'
import { Viewer } from '@domain/entities/viewer.entity'
import { imageFactory } from '@test/factories/image.factory'
import { InMemoryViewersRepository } from '@test/repositories/in-memory-viewers.repository'
import { CreateViewerUseCase } from './create-viewer.usecase'
import { DuplicatedEmailException } from './exceptions/duplicated-email.exception'

describe('CreateViewer Use Case', () => {
  let viewersRepository: InMemoryViewersRepository
  let image: ReturnType<typeof imageFactory>
  let createViewer: CreateViewerUseCase

  beforeEach(() => {
    viewersRepository = new InMemoryViewersRepository()
    image = imageFactory()
    createViewer = new CreateViewerUseCase(viewersRepository)
  })

  it('should be able to create a new viewew domain entity', async () => {
    const viewersBeforeCreation = await viewersRepository.findAll()
    const viewer = await createViewer.execute({
      name: 'John Doe',
      email: 'dummy@example.com',
      password: 'Ey&*%554iO',
      image
    })
    const viewersAfterCreation = await viewersRepository.findAll()

    expect(viewer.isRight()).toBe(true)
    expect(viewer.value).toBeInstanceOf(Viewer)
    expect(viewersBeforeCreation).toHaveLength(0)
    expect(viewersAfterCreation).toHaveLength(1)
  })

  it('should be able to throw an exception when the viewer email already exists', async () => {
    await createViewer.execute({
      name: 'John Doe',
      email: 'dummy@example.com',
      password: 'Ey&*%554iO',
      image
    })

    const viewer = await createViewer.execute({
      name: 'John Doe',
      email: 'dummy@example.com',
      password: 'Ey&*%554iO',
      image
    })

    const viewers = await viewersRepository.findAll()

    expect(viewer.isLeft()).toBe(true)
    expect(viewer.value).toBeInstanceOf(DuplicatedEmailException)
    expect(viewers).toHaveLength(1)
  })

  it('should be able to throw an exception when the viewer password, email or name are invalid', async () => {
    const viewerWithInvalidName = await createViewer.execute({
      name: 'Jo',
      email: 'dummy@example.com',
      password: 'Ey&*%554iO',
      image
    })

    const viewerWithInvalidEmail = await createViewer.execute({
      name: 'John Doe',
      email: 'dummy@exam',
      password: 'Ey&*%554iO',
      image
    })

    const viewerWithInvalidPassword = await createViewer.execute({
      name: 'John Doe',
      email: 'dummy_two@example.com',
      password: '12345678',
      image
    })

    const viewers = await viewersRepository.findAll()

    expect(viewerWithInvalidName.isLeft()).toBe(true)
    expect(viewerWithInvalidName.value).toBeInstanceOf(InvalidNameException)
    expect(viewerWithInvalidEmail.isLeft()).toBe(true)
    expect(viewerWithInvalidEmail.value).toBeInstanceOf(InvalidEmailException)
    expect(viewerWithInvalidPassword.isLeft()).toBe(true)
    expect(viewerWithInvalidPassword.value).toBeInstanceOf(
      InvalidPasswordException
    )
    expect(viewers).toHaveLength(0)
  })

  it('should be able to create a new viewew domain entity without provide an image', async () => {
    const viewer = await createViewer.execute({
      name: 'John Doe',
      email: 'dummy@example.com',
      password: 'Ey&*%554iO'
    })

    const viewers = await viewersRepository.findAll()

    expect(viewer.isRight()).toBe(true)
    expect(viewer.value).toBeInstanceOf(Viewer)
    expect(viewers).toHaveLength(1)
  })
})
