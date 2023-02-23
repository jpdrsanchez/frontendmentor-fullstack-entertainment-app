import { Either, left, right } from '@core/logic/either.core'
import { InvalidNameException } from './exceptions/invalid-name.exception'

type CreateNameResponse = Either<InvalidNameException, Name>

export class Name {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  private static validate(name: string) {
    return name.length >= 3
  }

  public static create(name: string): CreateNameResponse {
    if (!this.validate(name)) return left(new InvalidNameException())

    return right(new Name(name))
  }

  public get value() {
    return this._value
  }
}
