import { Image } from '@domain/entities/image.entity'
import { ImagesRepository } from '@domain/repositories/images.repository'

export class InMemoryImagesRepository implements ImagesRepository {
  private _images: Image[] = []

  public async create(image: Image) {
    this._images = [...this._images, image]
  }

  public async findAll() {
    return this._images
  }
}
