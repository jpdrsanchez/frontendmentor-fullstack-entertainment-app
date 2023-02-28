import { Image } from '@domain/entities/image.entity'

export abstract class ImagesRepository {
  abstract create(viewer: Image): Promise<void>
  abstract findAll(): Promise<Image>
}
