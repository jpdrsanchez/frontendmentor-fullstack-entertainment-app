import { Either, left, right } from '@core/logic/either.core'
import { isEmail } from '@core/utils/is-email.core'
import { isUUID } from '@core/utils/is-uuid.core'
import { Viewer } from '@domain/entities/viewer.entity'
import { ViewersRepository } from '@domain/repositories/viewers.repository'
import { ViewerNotFoundException } from './exceptions/viewer-not-found.exception'

export interface GetAuthenticatedViewerUseCaseRequest {
  idOrEmail: string
}
export type GetAuthenticatedViewerUseCaseResponse = Either<
  ViewerNotFoundException,
  Viewer
>

export class GetAuthenticatedViewerUseCase {
  constructor(private readonly viewersRepository: ViewersRepository) {}

  async execute(
    request: GetAuthenticatedViewerUseCaseRequest
  ): Promise<GetAuthenticatedViewerUseCaseResponse> {
    let viewer: Viewer

    if (isUUID(request.idOrEmail))
      viewer = await this.viewersRepository.findById(request.idOrEmail)
    if (isEmail(request.idOrEmail))
      viewer = await this.viewersRepository.findByEmail(request.idOrEmail)

    if (!viewer) return left(new ViewerNotFoundException())

    return right(viewer)
  }
}
