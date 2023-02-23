import { ExceptionTypes } from '@core/constants/exception-types'
import { DomainException } from '@core/domain/exceptions/domain.exception'

export class InvalidPasswordException extends DomainException {
  constructor() {
    super(
      'Invalid Password Exception',
      'The password must have at least 15 characters, 1 upper case letter, 1 special character and 1 number.',
      ExceptionTypes.VALIDATION
    )
  }
}
