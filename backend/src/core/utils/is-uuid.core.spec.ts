import * as crypto from 'node:crypto'
import { isUUID } from './is-uuid.core'

describe('Is uuid', () => {
  it('should be able to return true when the provided value is a valid UUID', () => {
    expect(isUUID('a24a6ea4-ce75-4665-a070-57453082c256')).toBe(true)
    expect(isUUID(crypto.randomUUID())).toBe(true)
    expect(isUUID('a24a6ea4-ce75-4665-a070')).toBe(false)
    expect(isUUID('wrong value')).toBe(false)
  })
})
