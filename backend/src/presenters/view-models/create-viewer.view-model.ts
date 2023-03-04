import { Viewer } from '@domain/entities/viewer.entity'

export class CreateViewerViewModel {
  static toHttp(viewer: Viewer) {
    return {
      id: viewer.id,
      name: viewer.name,
      email: viewer.email,
      ...(!!viewer.avatar && { avatar: { thumbnail: viewer.avatar.metadata } })
    }
  }
}
