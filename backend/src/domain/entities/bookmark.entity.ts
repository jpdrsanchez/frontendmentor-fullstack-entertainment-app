import { Entity } from '@core/domain/entity.core'
import { Optional } from '@core/logic/optional.core'

export interface BookmarkProps {
  videoId: string
  viewerId: string
  bookmarkedAt: Date
}

export type BookmarkPropsPayload = Optional<BookmarkProps, 'bookmarkedAt'>

export class Bookmark extends Entity<BookmarkProps> {
  private constructor(props: BookmarkPropsPayload) {
    super({
      ...props,
      bookmarkedAt: props.bookmarkedAt ?? new Date()
    })
  }

  public static create(props: BookmarkPropsPayload) {
    return new Bookmark(props)
  }

  public get videoId() {
    return this._props.videoId
  }

  public get viewerId() {
    return this._props.viewerId
  }

  public get bookmarkedAt() {
    return this._props.bookmarkedAt
  }
}
