import { Entity } from '../entity.core'

export class DummyEntity extends Entity<{ dummyProp: string }> {
  static create(props: { dummyProp: string }) {
    return new DummyEntity(props)
  }
}
