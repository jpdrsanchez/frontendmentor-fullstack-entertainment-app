import { ExceptionTypes } from '@core/constants/exception-types'
import { DomainException } from '@core/domain/exceptions/domain.exception'

export class InvalidSlugException extends DomainException {
  constructor() {
    super(
      'Invalid Slug Exception',
      'The provided slug must be more than 3 characters long',
      ExceptionTypes.VALIDATION
    )
  }
}
