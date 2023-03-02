import { Viewer } from '@domain/entities/viewer.entity'
import { ViewersRepository } from '@domain/repositories/viewers.repository'
import { Injectable } from '@nestjs/common'
import { ViewerMapper } from '../mappers/viewer.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaViewersRepository implements ViewersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(viewer: Viewer) {
    const toPrisma = ViewerMapper.toPrisma(viewer)

    await this.prismaService.viewer.create({ data: toPrisma })

    if (viewer.imageId)
      await this.prismaService.viewer.update({
        where: {
          id: viewer.id
        },
        data: {
          avatar: {
            connect: {
              id: viewer.imageId
            }
          }
        }
      })
  }

  public async update(viewer: Viewer) {
    viewer.id
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
      where: { email: viewerEmail }
    })

    if (!viewer) return undefined

    return ViewerMapper.toDomain(viewer)
  }

  public async findAll() {
    const viewers = await this.prismaService.viewer.findMany()

    return Promise.all(viewers.map(ViewerMapper.toDomain))
  }
}
