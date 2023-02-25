import { Entity } from '@core/domain/entity.core'
import { Optional } from '@core/logic/optional.core'
import { Title } from './value-objects/title'

export enum Rating {
  PG = 'PG',
  E = 'E',
  EGP = '18+'
}

export interface VideoProps {
  title: Title
  year: number
  imageId: string
  categoryId: string
  rating: Rating
  isTrending: boolean
  createdAt: Date
  updatedAt: Date
}

type VideoPropsPayload = Optional<
  VideoProps,
  'createdAt' | 'updatedAt' | 'isTrending'
>

export class Video extends Entity<VideoProps> {
  private constructor(props: VideoPropsPayload) {
    super({
      ...props,
      isTrending: !!props.isTrending,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date()
    })
  }

  public static create(props: VideoPropsPayload) {
    return new Video(props)
  }

  public get title() {
    return this._props.title.value
  }

  public get year() {
    return this._props.year
  }

  public get imageId() {
    return this._props.imageId
  }

  public get categoryId() {
    return this._props.categoryId
  }

  public get rating() {
    return this._props.rating
  }

  public get isTrending() {
    return this._props.isTrending
  }

  public get createdAt() {
    return this._props.createdAt
  }

  public get updatedAt() {
    return this._props.createdAt
  }
}
