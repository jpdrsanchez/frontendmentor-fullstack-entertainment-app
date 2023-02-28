import { Image, Metadata } from '@domain/entities/image.entity'
import { InvalidTitleException } from '@domain/entities/value-objects/exceptions/invalid-title.exception'
import { faker } from '@faker-js/faker'
import { InMemoryImagesRepository } from '@test/repositories/in-memory-images.repository'
import { CreateImageUseCase } from './create-image.usecase'

describe('CreateImage Use Case', () => {
  let imagesRepository: InMemoryImagesRepository
  let createImage: CreateImageUseCase
  let metadata: (size: number) => Metadata

  beforeEach(() => {
    imagesRepository = new InMemoryImagesRepository()
    createImage = new CreateImageUseCase(imagesRepository)
    metadata = (size: number): Metadata => ({
      width: size,
      height: size,
      url: faker.image.imageUrl(size, size, 'avatar')
    })
  })

  it('should be able to create an image domain entity', async () => {
    const imagesBeforeCreation = await imagesRepository.findAll()

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

    const imagesAfterCreation = await imagesRepository.findAll()

    expect(image.isRight()).toBe(true)
    expect(image.value).toBeInstanceOf(Image)
    expect(imagesBeforeCreation).toHaveLength(0)
    expect(imagesAfterCreation).toHaveLength(1)
  })

  it('should be able to throw an exception when the viewer password, email or name are invalid', async () => {
    const imageWithInvalidTitle = await createImage.execute({
      name: 'D',
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

    const images = await imagesRepository.findAll()

    expect(imageWithInvalidTitle.isLeft()).toBe(true)
    expect(imageWithInvalidTitle.value).toBeInstanceOf(InvalidTitleException)
    expect(images).toHaveLength(0)
  })
})
