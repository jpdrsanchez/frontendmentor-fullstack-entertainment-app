import { Either, left, right } from '@core/logic/either.core'
import { Replace } from '@core/logic/replace.core'
import { Image, ImagePropsPayload } from '@domain/entities/image.entity'
import { InvalidTitleException } from '@domain/entities/value-objects/exceptions/invalid-title.exception'
import { Title } from '@domain/entities/value-objects/title'

export type CreateImageServiceRequest = Replace<
  ImagePropsPayload,
  'name',
  { name: string }
>
export type CreateImageServiceResponse = Either<InvalidTitleException, Image>

export class CreateImageService {
  public static execute(
    request: CreateImageServiceRequest
  ): CreateImageServiceResponse {
    const titleOrError = Title.create(request.name)
    if (titleOrError.isLeft()) return left(titleOrError.value)

    return right(
      Image.create({
        name: titleOrError.value,
        description: request.description,
        extension: request.extension,
        metadata: request.metadata
      })
    )
  }
}
