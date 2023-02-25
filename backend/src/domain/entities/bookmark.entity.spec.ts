import { bookmarkFactory } from '@test/factories/bookmark.factory'
import { Bookmark } from './bookmark.entity'

describe('Bookmark Domain Entity', () => {
  it('should be able to create a new bookmark', async () => {
    const bookmark = await bookmarkFactory()

    expect(bookmark).toBeTruthy()
    expect(bookmark).toBeInstanceOf(Bookmark)
  })
})
