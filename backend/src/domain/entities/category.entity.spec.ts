import { categoryFactory } from '@test/factories/category.factory'
import { Category } from './category.entity'

describe('Category Domain Entity', () => {
  it('should be able to create a new category', () => {
    const category = categoryFactory()

    expect(category).toBeTruthy()
    expect(category).toBeInstanceOf(Category)
  })
})
