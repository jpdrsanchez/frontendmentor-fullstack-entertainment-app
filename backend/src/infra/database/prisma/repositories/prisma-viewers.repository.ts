import { Maybe } from '@core/logic/maybe.core'
import { Image } from '@domain/entities/image.entity'
import { Viewer } from '@domain/entities/viewer.entity'
import { ViewersRepository } from '@domain/repositories/viewers.repository'
import { Injectable } from '@nestjs/common'
import { ImageMapper } from '../mappers/image.mapper'
import { ViewerMapper } from '../mappers/viewer.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaViewersRepository implements ViewersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(viewer: Viewer) {
    const toPrisma = ViewerMapper.toPrisma(viewer)

    await this.prismaService.viewer.create({ data: toPrisma })
  }

  public async update(viewer: Viewer) {
    const toPrisma = ViewerMapper.toPrisma(viewer)

    if (toPrisma.imageId?.length) {
      const image = await this.prismaService.image.findUnique({
        where: { id: toPrisma.imageId }
      })

      await this.prismaService.viewer.update({
        where: {
          id: viewer.id
        },
        data: {
          avatar: {
            connect: {
              id: image.id
            }
          }
        }
      })
    }

    await this.prismaService.viewer.update({
      where: {
        id: viewer.id
      },
      data: {
        ...toPrisma
      }
    })
  }

  public async findById(viewerId: string) {
    const viewer = await this.prismaService.viewer.findUnique({
      where: { id: viewerId }
    })

    if (!viewer) return undefined

    return ViewerMapper.toDomain(viewer)
  }

  public async findByEmail(viewerEmail: string) {
    const viewer = await this.prismaService.viewer.findUnique({
      where: { email: viewerEmail },
      include: { avatar: true }
    })

    if (!viewer) return undefined
    let avatarOrNull: Maybe<Image> = null
    if (avatarOrNull) avatarOrNull = ImageMapper.toDomain(viewer.avatar)

    return ViewerMapper.toDomain(viewer, avatarOrNull)
  }

  public async findAll() {
    const viewers = await this.prismaService.viewer.findMany({
      include: { avatar: true }
    })

    return Promise.all(
      viewers.map(viewer => {
        let avatarOrNull: Maybe<Image> = null
        if (avatarOrNull) avatarOrNull = ImageMapper.toDomain(viewer.avatar)
        return ViewerMapper.toDomain(viewer, avatarOrNull)
      })
    )
  }
}
