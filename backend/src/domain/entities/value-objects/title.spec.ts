import { InvalidTitleException } from './exceptions/invalid-title.exception'
import { Title } from './title'

describe('Name Value Object', () => {
  it('should be able to create a valid title', () => {
    const validTitle = Title.create('Dummy Title')

    expect(validTitle.isRight()).toBeTruthy()
    expect(validTitle.value).toBeInstanceOf(Title)
  })

  it('should not be able to create an invalid title', () => {
    const invalidTitle = Title.create('Du')

    expect(invalidTitle.isLeft()).toBeTruthy()
    expect(invalidTitle.value).toBeInstanceOf(InvalidTitleException)
  })
})
