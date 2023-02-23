import { InvalidPasswordException } from './exceptions/invalid-password.exception'
import { Password } from './password'

const bcryptHashedRegex = /^\$2[ayb]\$.{56}$/
const strongPassword = 'AxXyui*#s@ei870987'
const weakPasswords = ['123456', 'dummy_password']

describe('Password Value Object', () => {
  it('should be able to hash a valid password', async () => {
    const validPasswrod = await Password.create(strongPassword)

    expect(validPasswrod.isRight()).toBeTruthy()
    expect(validPasswrod.value).toBeInstanceOf(Password)
    expect(
      bcryptHashedRegex.test((validPasswrod.value as Password).value)
    ).toBe(true)
    expect(
      (validPasswrod.value as Password).compare(strongPassword)
    ).resolves.toBe(true)
  })

  it('should not be able to hash an invalid password', async () => {
    for (const weakPassword of weakPasswords) {
      const invalidPasswrod = await Password.create(weakPassword)

      expect(invalidPasswrod.isLeft()).toBeTruthy()
      expect(invalidPasswrod.value).toBeInstanceOf(InvalidPasswordException)
    }
  })

  it('should return false when the password do not match with the hashed password', async () => {
    const validPasswrod = await Password.create(strongPassword)

    expect((validPasswrod.value as Password).compare('wrong')).resolves.toBe(
      false
    )
  })
})
