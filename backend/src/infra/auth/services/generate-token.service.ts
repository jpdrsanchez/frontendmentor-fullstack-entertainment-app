import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { AuthToken } from '../interfaces/token-auth-data.interface'

@Injectable()
export class GenerateTokenService {
  constructor(private readonly configService: ConfigService) {}

  generate(payload: AuthToken) {
    return jwt.sign(payload, this.configService.get('JWT_SECRET') ?? '', {
      expiresIn: '1h'
    })
  }
}
