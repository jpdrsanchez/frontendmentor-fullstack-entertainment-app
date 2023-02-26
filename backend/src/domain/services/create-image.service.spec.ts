import { ImageThumbnails, ThumbnailSizes } from '@config/images.config'
import { Image } from '@domain/entities/image.entity'
import { faker } from '@faker-js/faker'
import { CreateImageService, ImageMetadata } from './create-image.service'

describe('CreateImage Domain Service', () => {
  it('should be able to create an image domain entity', async () => {
    const name = 'Dummy Name'
    const description = 'Dummy Description'
    const extension = 'webp'
    const metadata: Pick<
      ImageThumbnails<
        Record<ThumbnailSizes, { width: number; height: number; url: string }>
      >,
      'avatar'
    > = {
      avatar: {
        small: {
          url: faker.image.avatar(),
          width: 1,
          height: 1
        },
        medium: {
          url: faker.image.avatar(),
          width: 1,
          height: 1
        },
        large: {
          url: faker.image.avatar(),
          width: 1,
          height: 1
        }
      }
    }

    const createdImage = await CreateImageService.execute({
      name,
      description,
      extension,
      metadata
    })

    const image = createdImage.value as Image<
      ImageMetadata<keyof typeof metadata>
    >

    expect(createdImage.isRight()).toBe(true)
    expect(createdImage.value).toBeInstanceOf(Image)
    expect(image.name).toBe(name)
    expect(image.extension).toBe(extension)
    expect(image.description).toBe(description)
    expect(image.metadata).toBe(metadata)
    expect(image.metadata.avatar).toBe(metadata.avatar)
  })
})
