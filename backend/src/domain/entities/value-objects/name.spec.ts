import { InvalidNameException } from './exceptions/invalid-name.exception'
import { Name } from './name'

describe('Name Value Object', () => {
  it('should be able to create a valid name', () => {
    const validName = Name.create('Dummy Name')

    expect(validName.isRight()).toBeTruthy()
    expect(validName.value).toBeInstanceOf(Name)
  })

  it('should not be able to create an invalid name', () => {
    const invalidName = Name.create('Du')

    expect(invalidName.isLeft()).toBeTruthy()
    expect(invalidName.value).toBeInstanceOf(InvalidNameException)
  })
})
