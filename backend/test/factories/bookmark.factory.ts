import { Bookmark, BookmarkProps } from '@domain/entities/bookmark.entity'
import { videoFactory } from './video.factory'
import { viewerFactory } from './viewer.factory'

export const bookmarkFactory = async (overrides?: Partial<BookmarkProps>) => {
  const viewer = await viewerFactory()
  const video = await videoFactory()

  return Bookmark.create({
    viewerId: viewer.id,
    videoId: video.id,
    ...overrides
  })
}
