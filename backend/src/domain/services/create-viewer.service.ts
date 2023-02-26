import { Either, left, right } from '@core/logic/either.core'
import { Replace } from '@core/logic/replace.core'
import { Image } from '@domain/entities/image.entity'
import { Email } from '@domain/entities/value-objects/email'
import { InvalidEmailException } from '@domain/entities/value-objects/exceptions/invalid-email.exception'
import { InvalidNameException } from '@domain/entities/value-objects/exceptions/invalid-name.exception'
import { InvalidPasswordException } from '@domain/entities/value-objects/exceptions/invalid-password.exception'
import { Name } from '@domain/entities/value-objects/name'
import { Password } from '@domain/entities/value-objects/password'
import { Viewer, ViewerPropsPayload } from '@domain/entities/viewer.entity'

export type CreateViewerServiceRequest<T> = Replace<
  ViewerPropsPayload,
  'name' | 'email' | 'password' | 'createdAt' | 'updatedAt' | 'imageId',
  { name: string; email: string; password: string; image?: Image<T> }
>

export type CreateViewerServiceResponse = Either<
  InvalidNameException | InvalidEmailException,
  Viewer
>

export class CreateViewerService {
  public static async execute<T>(
    request: CreateViewerServiceRequest<T>
  ): Promise<CreateViewerServiceResponse> {
    const nameOrError = Name.create(request.name)
    if (nameOrError.isLeft()) return left(new InvalidNameException())
    const emailOrError = Email.create(request.email)
    if (emailOrError.isLeft()) return left(new InvalidEmailException())
    const passwordOrError = await Password.create(request.password)
    if (passwordOrError.isLeft()) return left(new InvalidPasswordException())

    return right(
      Viewer.create({
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
        imageId: request.image?.id
      })
    )
  }
}
