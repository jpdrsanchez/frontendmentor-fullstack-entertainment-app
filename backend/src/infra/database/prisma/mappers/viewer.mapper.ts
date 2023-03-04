import { Maybe } from '@core/logic/maybe.core'
import { Email } from '@domain/entities/value-objects/email'
import { Name } from '@domain/entities/value-objects/name'
import { Password } from '@domain/entities/value-objects/password'
import { Viewer as DomainViewer } from '@domain/entities/viewer.entity'
import { Viewer as PrismaViewer } from '@prisma/client'
import { Image as DomainImage } from '@domain/entities/image.entity'
export class ViewerMapper {
  static async toDomain(
    viewer: PrismaViewer,
    avatar?: Maybe<DomainImage>
  ): Promise<DomainViewer> {
    return DomainViewer.create({
      name: Name.create(viewer.name).value as Name,
      email: Email.create(viewer.email).value as Email,
      password: (await Password.create(viewer.password)).value as Password,
      ...(!!avatar && { avatar }),
      createdAt: viewer.createdAt,
      updatedAt: viewer.updatedAt
    })
  }

  static toPrisma(viewer: DomainViewer): PrismaViewer {
    return {
      id: viewer.id,
      name: viewer.name,
      email: viewer.email,
      password: viewer.password.value,
      imageId: viewer.avatar?.id,
      createdAt: viewer.createdAt,
      updatedAt: viewer.updatedAt
    }
  }
}
