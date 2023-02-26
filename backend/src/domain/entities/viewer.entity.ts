import { Entity } from '@core/domain/entity.core'
import { Maybe } from '@core/logic/maybe.core'
import { Optional } from '@core/logic/optional.core'
import { Email } from './value-objects/email'
import { Name } from './value-objects/name'
import { Password } from './value-objects/password'

export interface ViewerProps {
  name: Name
  email: Email
  password: Password
  imageId: Maybe<string>
  createdAt: Date
  updatedAt: Date
}

export type ViewerPropsPayload = Optional<
  ViewerProps,
  'createdAt' | 'updatedAt' | 'imageId'
>

export class Viewer extends Entity<ViewerProps> {
  private constructor(props: ViewerPropsPayload) {
    super({
      ...props,
      imageId: props.imageId,
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

  public get imageId() {
    return this._props.imageId
  }

  public get createdAt() {
    return this._props.createdAt
  }

  public get updatedAt() {
    return this._props.updatedAt
  }
}
