import {
  imagesConfiguration,
  ImageThumbnails,
  ThumbnailSizes
} from '@config/images.config'
import { Image, ImageProps, Metadata } from '@domain/entities/image.entity'
import { Title } from '@domain/entities/value-objects/title'
import { faker } from '@faker-js/faker'

export const defineImageMetadataThumbnailsData = (
  thumbnail: keyof ImageThumbnails<unknown>
) => {
  const sizes: Record<ThumbnailSizes, ''> = {
    small: '',
    large: '',
    medium: ''
  }

  const sizesArr = Object.keys(sizes)

  return sizesArr.reduce<
    Record<ThumbnailSizes, { width: number; height: number; url: string }>
  >((acc, curr) => {
    return {
      ...acc,
      [curr]: {
        ...imagesConfiguration.thumbnail[thumbnail][curr],
        url: faker.image.imageUrl(
          imagesConfiguration.thumbnail[thumbnail][curr].width,
          imagesConfiguration.thumbnail[thumbnail][curr].height,
          'avatar'
        )
      }
    }
  }, {} as Record<ThumbnailSizes, Metadata>)
}

export const imageFactory = (overrides?: Partial<ImageProps>) => {
  const name = Title.create(faker.lorem.words(2)).value as Title

  return Image.create({
    name,
    description: 'Dummy description',
    extension: 'webp',
    metadata: {
      avatar: {
        ...defineImageMetadataThumbnailsData('avatar')
      }
    },
    ...overrides
  })
}
