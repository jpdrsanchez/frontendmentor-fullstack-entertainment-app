import { Either, left } from '@core/logic/either.core'
import { Image } from '@domain/entities/image.entity'
import { ImagesRepository } from '@domain/repositories/images.repository'
import {
  CreateImageService,
  CreateImageServiceRequest
} from '@domain/services/create-image.service'

export type CreateImageUseCaseRequest = CreateImageServiceRequest
export type CreateImageUseCaseResponse = Either<Error, Image>

export class CreateImageUseCase {
  constructor(private readonly imagesRepository: ImagesRepository) {}

  async execute(
    request: CreateImageUseCaseRequest
  ): Promise<CreateImageUseCaseResponse> {
    const imageOrError = CreateImageService.execute(request)
    if (imageOrError.isLeft()) return left(imageOrError.value)

    await this.imagesRepository.create(imageOrError.value)

    return imageOrError
  }
}
