import { Category, CategoryProps } from '@domain/entities/category.entity'
import { Slug } from '@domain/entities/value-objects/slug'
import { Title } from '@domain/entities/value-objects/title'
import { faker } from '@faker-js/faker'

export const categoryFactory = (overrides?: Partial<CategoryProps>) => {
  const title = Title.create(faker.lorem.words(3)).value as Title
  const slug = Slug.create(title.value).value as Slug

  return Category.create({
    title,
    slug,
    ...overrides
  })
}
