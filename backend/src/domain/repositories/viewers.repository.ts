import { Viewer } from '@domain/entities/viewer.entity'

export abstract class ViewersRepository {
  abstract create(viewer: Viewer): Promise<void>
  abstract update(viewer: Viewer): Promise<void>
  abstract findById(viewerId: string): Promise<Viewer>
  abstract findByEmail(viewerEmail: string): Promise<Viewer>
  abstract findAll(): Promise<Viewer[]>
}
