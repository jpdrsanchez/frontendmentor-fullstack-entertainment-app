import { ExceptionTypes } from '@core/constants/exception-types'
import { DomainException } from '@core/domain/exceptions/domain.exception'

export class InvalidNameException extends DomainException {
  constructor() {
    super(
      'Invalid Name Exception',
      'The name must be more than 3 characters long',
      ExceptionTypes.VALIDATION
    )
  }
}
