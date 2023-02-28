import { Entity } from '@core/domain/entity.core'
import { Optional } from '@core/logic/optional.core'

export interface Metadata {
  url: string
  width: number
  height: number
}

export interface ImageProps {
  name: string
  description: string
  extension: string
  metadata: Record<
    string,
    { small: Metadata; medium: Metadata; large: Metadata }
  >
  createdAt: Date
  updatedAt: Date
}

export type ImagePropsPayload = Optional<ImageProps, 'createdAt' | 'updatedAt'>

export class Image extends Entity<ImageProps> {
  private constructor(props: ImagePropsPayload) {
    super({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date()
    })
  }

  public static create(props: ImagePropsPayload) {
    return new Image(props)
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
