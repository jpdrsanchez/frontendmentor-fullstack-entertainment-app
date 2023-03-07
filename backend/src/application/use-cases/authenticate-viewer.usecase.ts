import { Either, left, right } from '@core/logic/either.core'
import { Viewer } from '@domain/entities/viewer.entity'
import { ViewersRepository } from '@domain/repositories/viewers.repository'
import { IncorrectCredentialsException } from './exceptions/incorrect-credentials.exception'

export interface AuthenticateViewerUseCaseRequest {
  email: string
  password: string
}

export type AuthenticateViewerUseCaseResponse = Either<
  IncorrectCredentialsException,
  Viewer
>

export class AuthenticateViewerUseCase {
  constructor(private readonly viewersRepository: ViewersRepository) {}

  async execute(
    request: AuthenticateViewerUseCaseRequest
  ): Promise<AuthenticateViewerUseCaseResponse> {
    const viewerOrEmpty = await this.viewersRepository.findByEmail(
      request.email
    )

    if (!viewerOrEmpty) return left(new IncorrectCredentialsException())

    const comparedPassword = await viewerOrEmpty.password.compare(
      request.password
    )

    if (!comparedPassword) return left(new IncorrectCredentialsException())

    return right(viewerOrEmpty)
  }
}
