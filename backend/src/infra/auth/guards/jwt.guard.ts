import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly tokenRegex: RegExp

  constructor(private readonly configService: ConfigService) {
    this.tokenRegex = new RegExp(/Bearer\s([\S]*$)/)
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    if (!this.tokenRegex.test(request.headers.authorization || ''))
      throw new UnauthorizedException()

    const token =
      request.headers.authorization?.replace(this.tokenRegex, '$1') ?? ''

    try {
      const res = jwt.verify(token, this.configService.get('JWT_SECRET') ?? '')
      Object.defineProperty(request, 'viewer', { value: res })
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}
