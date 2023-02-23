import * as uuid from 'uuid'

interface EntityContract {
  id: string
}

export class Entity<T> implements EntityContract {
  protected readonly _id: string
  protected readonly _props: T

  protected constructor(props: T, id?: string) {
    this._id = id ?? uuid.v4()
    this._props = props
  }

  public get id() {
    return this._id
  }
}
