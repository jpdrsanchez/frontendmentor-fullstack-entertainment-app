import { Image, Metadata } from '@domain/entities/image.entity'
import { InvalidEmailException } from '@domain/entities/value-objects/exceptions/invalid-email.exception'
import { InvalidNameException } from '@domain/entities/value-objects/exceptions/invalid-name.exception'
import { InvalidPasswordException } from '@domain/entities/value-objects/exceptions/invalid-password.exception'
import { Viewer } from '@domain/entities/viewer.entity'
import { faker } from '@faker-js/faker'
import { InMemoryImagesRepository } from '@test/repositories/in-memory-images.repository'
import { InMemoryViewersRepository } from '@test/repositories/in-memory-viewers.repository'
import { AttachImageToViewerUseCase } from './attach-image-to-viewer.usecase'
import { CreateImageUseCase } from './create-image.usecase'
import { CreateViewerUseCase } from './create-viewer.usecase'
import { DuplicatedEmailException } from './exceptions/duplicated-email.exception'

describe('CreateViewer Use Case', () => {
  let viewersRepository: InMemoryViewersRepository
  let attachImageToViewer: AttachImageToViewerUseCase
  let createViewer: CreateViewerUseCase
  let imagesRepository: InMemoryImagesRepository
  let createImage: CreateImageUseCase
  let metadata: (size: number) => Metadata

  beforeEach(() => {
    viewersRepository = new InMemoryViewersRepository()
    attachImageToViewer = new AttachImageToViewerUseCase(viewersRepository)
    createViewer = new CreateViewerUseCase(viewersRepository)
    imagesRepository = new InMemoryImagesRepository()
    createImage = new CreateImageUseCase(imagesRepository)
    metadata = (size: number): Metadata => ({
      width: size,
      height: size,
      url: faker.image.imageUrl(size, size, 'avatar')
    })
  })

  it('should be able to attach an existing image to the selected viewer', async () => {
    const viewer = await createViewer.execute({
      name: 'John Doe',
      email: 'dummy@example.com',
      password: 'Ey&*%554iO'
    })
    const image = await createImage.execute({
      name: 'Dummy Image',
      description: 'Dummy description',
      extension: 'webp',
      metadata: {
        avatar: {
          large: metadata(512),
          medium: metadata(256),
          small: metadata(128)
        }
      }
    })

    await attachImageToViewer.execute({
      viewer: viewer.value as Viewer,
      image: image.value as Image
    })

    const [foundViewer] = await viewersRepository.findAll()

    expect((viewer.value as Viewer).avatar).toBe(image.value)
    expect(foundViewer.avatar).toBe(image.value)
  })

  it('should be able to throw an exception when the viewer email already exists', async () => {
    await createViewer.execute({
      name: 'John Doe',
      email: 'dummy@example.com',
      password: 'Ey&*%554iO'
    })

    const viewer = await createViewer.execute({
      name: 'John Doe',
      email: 'dummy@example.com',
      password: 'Ey&*%554iO'
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
      password: 'Ey&*%554iO'
    })

    const viewerWithInvalidEmail = await createViewer.execute({
      name: 'John Doe',
      email: 'dummy@exam',
      password: 'Ey&*%554iO'
    })

    const viewerWithInvalidPassword = await createViewer.execute({
      name: 'John Doe',
      email: 'dummy_two@example.com',
      password: '12345678'
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
