import { isEmail } from './is-email.core'

describe('Is email', () => {
  it('should be able to return true when the provided value is a valid email', () => {
    const validEmails = [
      'dummy@example.com',
      'dummy.example@example.com',
      'dummy_example@example.com'
    ]
    const invalidEmails = [
      'dummy@example.',
      'dummy.example@.com',
      '@example.com',
      'dummy@example'
    ]

    validEmails.forEach(validEmail => {
      expect(isEmail(validEmail)).toBe(true)
    })
    invalidEmails.forEach(invalidEmail => {
      expect(isEmail(invalidEmail)).toBe(false)
    })
  })
})
