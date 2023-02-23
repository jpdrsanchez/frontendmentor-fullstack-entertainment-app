import { Entity } from './entity.core'
import { DummyEntity } from './_test-utils/dummy-entity'

describe('Entity Core', () => {
  it('should be able to be extended by other classes', () => {
    const dummyClass = DummyEntity.create({ dummyProp: 'dummy value' })

    expect(dummyClass).toBeTruthy()
    expect(dummyClass.id).toBeDefined()
    expect(dummyClass).toBeInstanceOf(Entity)
  })
})
