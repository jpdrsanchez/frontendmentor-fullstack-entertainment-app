import { ExceptionTypes } from '@core/constants/exception-types'
import { DomainException } from '@core/domain/exceptions/domain.exception'

export class InvalidEmailException extends DomainException {
  constructor() {
    super(
      'Invalid Email Exception',
      'The email must be valid',
      ExceptionTypes.VALIDATION
    )
  }
}
