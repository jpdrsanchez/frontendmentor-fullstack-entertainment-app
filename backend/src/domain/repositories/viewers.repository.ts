import { Viewer } from '@domain/entities/viewer.entity'

export abstract class ViewersRepository {
  abstract create(viewer: Viewer): Promise<void>
  abstract update(viewer: Viewer): Promise<void>
  abstract findById(viewerId: string): Promise<Viewer | undefined>
  abstract findByEmail(viewerEmail: string): Promise<Viewer | undefined>
  abstract findAll(): Promise<Viewer[]>
}
