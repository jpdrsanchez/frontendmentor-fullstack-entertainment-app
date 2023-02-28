import { Either, right } from '@core/logic/either.core'
import { Image, ImagePropsPayload } from '@domain/entities/image.entity'

export type CreateImageServiceRequest = ImagePropsPayload
export type CreateImageServiceResponse = Either<Error, Image>

export class CreateImageService {
  public static async execute(
    request: CreateImageServiceRequest
  ): Promise<CreateImageServiceResponse> {
    return right(
      Image.create({
        name: request.name,
        description: request.description,
        extension: request.extension,
        metadata: request.metadata
      })
    )
  }
}
