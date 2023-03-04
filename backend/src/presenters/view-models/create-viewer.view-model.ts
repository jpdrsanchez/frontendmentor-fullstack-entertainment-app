import { Maybe } from '@core/logic/maybe.core'
import { Image } from '@domain/entities/image.entity'
import { Viewer } from '@domain/entities/viewer.entity'

export class CreateViewerViewModel {
  static toHttp(viewer: Viewer, image: Maybe<Image>) {
    return {
      id: viewer.id,
      name: viewer.name,
      email: viewer.email,
      avatar: {
        ...(!!image && { thumbnail: image.metadata })
      }
    }
  }
}
