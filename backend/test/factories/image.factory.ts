import {
  imagesConfiguration,
  ImageThumbnails,
  ThumbnailSizes
} from '@config/images.config'
import { Image, ImageProps } from '@domain/entities/image.entity'
import { faker } from '@faker-js/faker'

type ImageMetadata<T extends keyof ImageThumbnails<unknown>> = Pick<
  ImageThumbnails<
    Record<ThumbnailSizes, { width: number; height: number; url: string }>
  >,
  T
>

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
  }, {} as Record<ThumbnailSizes, { width: number; height: number; url: string }>)
}

export const imageFactory = <T extends keyof ImageThumbnails<unknown>>(
  overrides?: Partial<ImageProps<ImageMetadata<T>>>
) => {
  return Image.create<
    Partial<ImageMetadata<'avatar' | 'regular' | 'trending'>>
  >({
    name: 'Dummy Name',
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
