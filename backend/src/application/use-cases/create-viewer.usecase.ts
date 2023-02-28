import { Either, left } from '@core/logic/either.core'
import { InvalidEmailException } from '@domain/entities/value-objects/exceptions/invalid-email.exception'
import { InvalidNameException } from '@domain/entities/value-objects/exceptions/invalid-name.exception'
import { InvalidPasswordException } from '@domain/entities/value-objects/exceptions/invalid-password.exception'
import { Viewer } from '@domain/entities/viewer.entity'
import { ViewersRepository } from '@domain/repositories/viewers.repository'
import {
  CreateViewerService,
  CreateViewerServiceRequest
} from '@domain/services/create-viewer.service'
import { DuplicatedEmailException } from './exceptions/duplicated-email.exception'

export type CreateViewerUseCaseRequest<T> = CreateViewerServiceRequest<T>
export type CreateViewerUseCaseResponse = Either<
  | InvalidNameException
  | InvalidEmailException
  | InvalidPasswordException
  | DuplicatedEmailException,
  Viewer
>

export class CreateViewerUseCase {
  constructor(private readonly viewersRepository: ViewersRepository) {}

  async execute<T>(
    request: CreateViewerUseCaseRequest<T>
  ): Promise<CreateViewerUseCaseResponse> {
    const viewerOrError = await CreateViewerService.execute(request)
    if (viewerOrError.isLeft()) return left(viewerOrError.value)

    const emailAlreadyExists = await this.viewersRepository.findByEmail(
      viewerOrError.value.email
    )
    if (emailAlreadyExists) return left(new DuplicatedEmailException())

    await this.viewersRepository.create(viewerOrError.value)

    return viewerOrError
  }
}
