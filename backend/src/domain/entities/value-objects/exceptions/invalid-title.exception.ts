import { ExceptionTypes } from '@core/constants/exception-types'
import { DomainException } from '@core/domain/exceptions/domain.exception'

export class InvalidTitleException extends DomainException {
  constructor() {
    super(
      'Invalid Title Exception',
      'The title must be more than 3 characters long',
      ExceptionTypes.VALIDATION
    )
  }
}
