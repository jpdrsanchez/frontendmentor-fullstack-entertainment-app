import { InvalidSlugException } from './exceptions/invalid-slug.exception'
import { Slug } from './slug'

describe('Slug Value Object', () => {
  it('should be able to create a valid slug', () => {
    const validSlug = Slug.create('This is my valid  slug string  ')

    expect(validSlug.isRight()).toBe(true)
    expect(validSlug.value).toBeInstanceOf(Slug)
    expect((validSlug.value as Slug).value).toMatch(/[^A-Z\s]/g)
    expect((validSlug.value as Slug).value).toMatch(
      'this-is-my-valid-slug-string'
    )
  })

  it('should not be able to create an invalid slug', () => {
    const invalidSlug = Slug.create('Th')

    expect(invalidSlug.isLeft()).toBeTruthy()
    expect(invalidSlug.value).toBeInstanceOf(InvalidSlugException)
  })
})
