import { Entity } from '@core/domain/entity.core'
import { Optional } from '@core/logic/optional.core'
import { Slug } from './value-objects/slug'
import { Title } from './value-objects/title'

export interface CategoryProps {
  title: Title
  slug: Slug
  createdAt: Date
  updatedAt: Date
}

type CategoryPropsPayload = Optional<CategoryProps, 'createdAt' | 'updatedAt'>

export class Category extends Entity<CategoryProps> {
  private constructor(props: CategoryPropsPayload) {
    super({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date()
    })
  }

  public static create(props: CategoryPropsPayload) {
    return new Category(props)
  }

  public get title() {
    return this._props.title.value
  }

  public get slug() {
    return this._props.slug.value
  }

  public get createdAt() {
    return this._props.createdAt
  }

  public get updatedAt() {
    return this._props.updatedAt
  }
}
