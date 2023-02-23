import { Either, left, right } from '@core/logic/either.core'
import { InvalidEmailException } from './exceptions/invalid-email.exception'

type CreateEmailResponse = Either<InvalidEmailException, Email>

export class Email {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  private static format(email: string) {
    return email.toLowerCase()
  }

  private static validate(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(email)
  }

  public static create(email: string): CreateEmailResponse {
    if (!this.validate(email)) return left(new InvalidEmailException())

    return right(new Email(this.format(email)))
  }

  public get value() {
    return this._value
  }
}
