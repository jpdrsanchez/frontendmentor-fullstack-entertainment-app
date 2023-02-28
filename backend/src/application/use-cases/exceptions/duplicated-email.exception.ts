import { ApplicationException } from '@core/application/exceptions/application.exception'
import { ExceptionTypes } from '@core/constants/exception-types'

export class DuplicatedEmailException extends ApplicationException {
  constructor() {
    super(
      'Duplicated email exception',
      'The provided email address already exists.',
      ExceptionTypes.BAD_REQUEST
    )
  }
}
