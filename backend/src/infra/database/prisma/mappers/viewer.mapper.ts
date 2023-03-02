import { Email } from '@domain/entities/value-objects/email'
import { Name } from '@domain/entities/value-objects/name'
import { Password } from '@domain/entities/value-objects/password'
import { Viewer as DomainViewer } from '@domain/entities/viewer.entity'
import { Viewer as PrismaViewer } from '@prisma/client'

export class ViewerMapper {
  static async toDomain(viewer: PrismaViewer): Promise<DomainViewer> {
    return DomainViewer.create({
      name: Name.create(viewer.name).value as Name,
      email: Email.create(viewer.email).value as Email,
      password: (await Password.create(viewer.password)).value as Password,
      imageId: viewer.imageId,
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
      imageId: viewer.imageId,
      createdAt: viewer.createdAt,
      updatedAt: viewer.updatedAt
    }
  }
}
