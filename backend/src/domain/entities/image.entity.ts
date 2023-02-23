import { Entity } from '@core/domain/entity.core'
import { Optional } from '@core/logic/optional.core'

export interface ImageProps<T> {
  name: string
  description: string
  extension: string
  metadata: T
  createdAt: Date
  updatedAt: Date
}

export type ImagePropsPayload<T> = Optional<
  ImageProps<T>,
  'createdAt' | 'updatedAt'
>

export class Image<T> extends Entity<ImageProps<T>> {
  private constructor(props: ImagePropsPayload<T>) {
    super({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date()
    })
  }

  public static create<T>(props: ImagePropsPayload<T>) {
    return new Image<T>(props)
  }

  public get name() {
    return this._props.name
  }

  public get description() {
    return this._props.description
  }

  public get extension() {
    return this._props.extension
  }

  public get metadata() {
    return this._props.metadata
  }

  public get createdAt() {
    return this._props.createdAt
  }

  public get updatedAt() {
    return this._props.updatedAt
  }
}
