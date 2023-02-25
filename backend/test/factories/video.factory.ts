import { Title } from '@domain/entities/value-objects/title'
import { Video, VideoProps } from '@domain/entities/video.entity'
import { faker } from '@faker-js/faker'
import { imageFactory } from './image.factory'

export const videoFactory = async (overrides?: Partial<VideoProps>) => {
  const title = Title.create(faker.name.fullName()).value as Title
  const image = imageFactory()

  return Video.create({
    title,
    year: faker.datatype.number({ min: 1990, max: new Date().getFullYear() }),
    rating: faker.helpers.arrayElement(),
    categoryId: '',
    imageId: image.id,
    ...overrides
  })
}
