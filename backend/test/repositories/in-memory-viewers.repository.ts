import { Viewer } from '@domain/entities/viewer.entity'
import { ViewersRepository } from '@domain/repositories/viewers.repository'

export class InMemoryViewersRepository extends ViewersRepository {
  private _viewers: Viewer[] = []

  public async create(viewer: Viewer) {
    this._viewers = [...this._viewers, viewer]
  }

  public async update(viewer: Viewer) {
    this._viewers = [
      ...this._viewers.filter(_viewer => _viewer.id !== viewer.id),
      viewer
    ]
  }

  public async findById(viewerId: string) {
    return this._viewers.find(_viewer => _viewer.id === viewerId)
  }

  public async findByEmail(viewerEmail: string) {
    return this._viewers.find(_viewer => _viewer.email === viewerEmail)
  }

  public async findAll() {
    return this._viewers
  }
}
