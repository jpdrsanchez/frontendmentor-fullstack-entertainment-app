import { ApplicationException } from '@core/application/exceptions/application.exception'
import { ExceptionTypes } from '@core/constants/exception-types'

export class IncorrectCredentialsException extends ApplicationException {
  constructor() {
    super(
      'Incorrect credentials exception',
      'The provided e-mail or password are incorrect',
      ExceptionTypes.BAD_REQUEST
    )
  }
}
