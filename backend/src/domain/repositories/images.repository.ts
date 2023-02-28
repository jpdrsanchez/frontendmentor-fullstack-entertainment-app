import { Image } from '@domain/entities/image.entity'

export abstract class ImagesRepository {
  abstract create<T>(viewer: Image<T>): Promise<void>
  abstract findAll<T>(): Promise<Image<T>[]>
}
