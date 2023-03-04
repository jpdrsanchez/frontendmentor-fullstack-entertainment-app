import { ApplicationException } from '@core/application/exceptions/application.exception'
import { DomainException } from '@core/domain/exceptions/domain.exception'
import { BadRequestException, HttpException } from '@nestjs/common'

export class ApplicationExceptionPresenter {
  static toHttp(exception: DomainException | ApplicationException | Error) {
    if (
      !(exception instanceof DomainException) &&
      !(exception instanceof ApplicationException)
    ) {
      return new BadRequestException(exception.message, { cause: exception })
    }

    return new HttpException(
      {
        statusCode: exception.status,
        message: exception.message,
        error: exception.name
      },
      exception.status,
      {
        cause: exception,
        description: exception.message
      }
    )
  }
}
