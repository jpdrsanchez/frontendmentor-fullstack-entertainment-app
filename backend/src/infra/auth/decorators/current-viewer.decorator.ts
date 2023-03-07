import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import {
  AuthToken,
  TokenAuthData
} from '../interfaces/token-auth-data.interface'

export const CurrentViewer = createParamDecorator(
  (_: unknown, context: ExecutionContext): TokenAuthData => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { viewer: AuthToken }>()

    return request.viewer.data
  }
)
