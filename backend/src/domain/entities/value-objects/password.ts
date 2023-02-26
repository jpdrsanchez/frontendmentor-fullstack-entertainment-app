import { Either, left, right } from '@core/logic/either.core'
import { InvalidPasswordException } from './exceptions/invalid-password.exception'
import * as bcrypt from 'bcrypt'

type CreatePasswordResponse = Either<InvalidPasswordException, Password>

export class Password {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  private static async hash(password: string) {
    return bcrypt.hash(password, 10)
  }

  private static isBcryptHashed(password: string) {
    const bcryptHashedRegex = /^\$2[ayb]\$.{56}$/

    return bcryptHashedRegex.test(password)
  }

  private static validate(password: string) {
    if (this.isBcryptHashed(password)) return true

    const strongPasswordRegex =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/

    return strongPasswordRegex.test(password)
  }

  public static async create(
    password: string
  ): Promise<CreatePasswordResponse> {
    if (!this.validate(password)) return left(new InvalidPasswordException())
    const hashedPassword = await this.hash(password)

    return right(new Password(hashedPassword))
  }

  public async compare(password: string) {
    return bcrypt.compare(password, this._value)
  }

  public get value() {
    return this._value
  }
}
