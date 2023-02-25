import { Either, left, right } from '@core/logic/either.core'
import slugify from 'slugify'
import { InvalidSlugException } from './exceptions/invalid-slug.exception'

type CreateSlugResponse = Either<InvalidSlugException, Slug>

export class Slug {
  private readonly _value: string

  private constructor(value: string) {
    this._value = value
  }

  private static validate(slug: string) {
    return slug.length >= 3
  }

  private static format(slug: string) {
    return slugify(slug, { lower: true })
  }

  public static create(slug: string): CreateSlugResponse {
    if (!this.validate(slug)) return left(new InvalidSlugException())

    return right(new Slug(this.format(slug)))
  }

  public get value() {
    return this._value
  }
}
