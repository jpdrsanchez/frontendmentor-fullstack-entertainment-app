import { Viewer } from '@domain/entities/viewer.entity'

export type TokenAuthData = Pick<Viewer, 'id' | 'email'>

export interface AuthToken {
  data: TokenAuthData
}
