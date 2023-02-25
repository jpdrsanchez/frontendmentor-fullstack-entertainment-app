import { Either, left, right } from '@core/logic/either.core'
import { InvalidTitleException } from './exceptions/invalid-title.exception'

type CreateTitleResponse = Either<InvalidTitleException, Title>

export class Title {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  private static validate(title: string) {
    return title.length >= 3
  }

  public static create(title: string): CreateTitleResponse {
    if (!this.validate(title)) return left(new InvalidTitleException())

    return right(new Title(title))
  }

  public get value() {
    return this._value
  }
}
