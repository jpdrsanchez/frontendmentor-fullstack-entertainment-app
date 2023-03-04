import { Image } from '@domain/entities/image.entity'
import { ImagesRepository } from '@domain/repositories/images.repository'
import { Injectable } from '@nestjs/common'
import { ImageMapper } from '../mappers/image.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaImagesRepository implements ImagesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(image: Image) {
    const toPrisma = ImageMapper.toPrisma(image)

    await this.prismaService.image.create({ data: toPrisma })
  }

  public async findAll() {
    const images = await this.prismaService.image.findMany()

    return Promise.all(images.map(ImageMapper.toDomain))
  }
}
