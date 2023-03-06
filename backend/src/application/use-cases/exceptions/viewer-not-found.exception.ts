import { ApplicationException } from '@core/application/exceptions/application.exception'
import { ExceptionTypes } from '@core/constants/exception-types'

export class ViewerNotFoundException extends ApplicationException {
  constructor() {
    super(
      'Viewer not found exception',
      'The provided viewer could not be found.',
      ExceptionTypes.NOT_FOUND
    )
  }
}
