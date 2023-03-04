import { Image } from '@domain/entities/image.entity'
import { Viewer } from '@domain/entities/viewer.entity'
import { ViewersRepository } from '@domain/repositories/viewers.repository'

export interface AttachImageToViewerUseCaseRequest {
  viewer: Viewer
  image: Image
}

export class AttachImageToViewerUseCase {
  constructor(private readonly viewersRepository: ViewersRepository) {}

  async execute(request: AttachImageToViewerUseCaseRequest) {
    request.viewer.avatar = request.image
    request.viewer.update()

    await this.viewersRepository.update(request.viewer)
  }
}
