import { Entity } from '@core/domain/entity.core'
import { Maybe } from '@core/logic/maybe.core'
import { Optional } from '@core/logic/optional.core'
import { Image } from './image.entity'
import { Email } from './value-objects/email'
import { Name } from './value-objects/name'
import { Password } from './value-objects/password'

export interface ViewerProps {
  name: Name
  email: Email
  password: Password
  avatar: Maybe<Image>
  createdAt: Date
  updatedAt: Date
}

export type ViewerPropsPayload = Optional<
  ViewerProps,
  'createdAt' | 'updatedAt' | 'avatar'
>

export class Viewer extends Entity<ViewerProps> {
  private constructor(props: ViewerPropsPayload) {
    super({
      ...props,
      avatar: props.avatar,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date()
    })
  }

  public static create(props: ViewerPropsPayload) {
    return new Viewer(props)
  }

  public get name() {
    return this._props.name.value
  }

  public get email() {
    return this._props.email.value
  }

  public get password() {
    return this._props.password
  }

  public get avatar() {
    return this._props.avatar
  }

  public set avatar(value: Image) {
    this._props.avatar = value
  }

  public get createdAt() {
    return this._props.createdAt
  }

  public get updatedAt() {
    return this._props.updatedAt
  }

  public update() {
    this._props.updatedAt = new Date()
  }
}
