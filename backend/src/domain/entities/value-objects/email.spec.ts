import { Email } from './email'
import { InvalidEmailException } from './exceptions/invalid-email.exception'

describe('Email Value Object', () => {
  it('should be able to create a valid email', () => {
    const validEmails = [
      'dummy@example.com',
      'dummy.example@example.com',
      'dummy_example@example.com'
    ]

    validEmails.forEach(validEmail => {
      const email = Email.create(validEmail)

      expect(email.isRight()).toBeTruthy()
      expect(email.value).toBeInstanceOf(Email)
    })
  })

  it('should not be able to create an invalid name', () => {
    const invalidEmails = [
      'dummy@example.',
      'dummy.example@.com',
      '@example.com',
      'dummy@example'
    ]

    invalidEmails.forEach(invalidEmail => {
      const email = Email.create(invalidEmail)

      expect(email.isLeft()).toBeTruthy()
      expect(email.value).toBeInstanceOf(InvalidEmailException)
    })
  })
})
