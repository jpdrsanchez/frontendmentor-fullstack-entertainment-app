import { Image as DomainImage, ImageProps } from '@domain/entities/image.entity'
import { Image as PrismaImage, Prisma } from '@prisma/client'
import { Title } from '@domain/entities/value-objects/title'

export class ImageMapper {
  static toDomain(image: PrismaImage): DomainImage {
    return DomainImage.create({
      name: Title.create(image.name).value as Title,
      description: image.description,
      extension: image.extension,
      metadata: image.metadata as ImageProps['metadata'],
      createdAt: image.createdAt,
      updatedAt: image.updatedAt
    })
  }

  static toPrisma(image: DomainImage): PrismaImage {
    return {
      id: image.id,
      name: image.name,
      description: image.description,
      extension: image.extension,
      metadata: image.metadata as Prisma.JsonObject,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt
    }
  }
}
