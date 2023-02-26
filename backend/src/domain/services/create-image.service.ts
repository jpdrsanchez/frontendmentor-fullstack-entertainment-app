import { ImageThumbnails, ThumbnailSizes } from '@config/images.config'
import { Either, right } from '@core/logic/either.core'
import { Image, ImagePropsPayload } from '@domain/entities/image.entity'

export type ImageMetadata<K extends keyof ImageThumbnails<unknown>> = Pick<
  ImageThumbnails<
    Record<ThumbnailSizes, { width: number; height: number; url: string }>
  >,
  K
>

export type CreateImageServiceRequest<
  K extends keyof ImageThumbnails<unknown>
> = ImagePropsPayload<ImageMetadata<K>>
export type CreateImageServiceResponse<K extends keyof ImageThumbnails<K>> =
  Either<Error, Image<ImageMetadata<K>>>

export class CreateImageService {
  public static async execute<K extends keyof ImageThumbnails<unknown>>(
    request: CreateImageServiceRequest<K>
  ): Promise<CreateImageServiceResponse<K>> {
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
