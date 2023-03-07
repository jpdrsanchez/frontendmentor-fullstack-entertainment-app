import { Viewer } from '@domain/entities/viewer.entity'

export class AuthMeViewModel {
  static toHttp(viewer: Viewer, token: string) {
    return {
      token,
      viewer: {
        id: viewer.id,
        name: viewer.name,
        email: viewer.email,
        ...(!!viewer.avatar && {
          avatar: { thumbnail: viewer.avatar.metadata }
        })
      }
    }
  }
}
