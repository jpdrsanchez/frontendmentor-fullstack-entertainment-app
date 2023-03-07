import globalConfig from '@config/global.config'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JWTGuard } from './guards/jwt.guard'
import { GenerateTokenService } from './services/generate-token.service'

@Module({
  imports: [ConfigModule.forRoot({ load: [globalConfig] })],
  providers: [JWTGuard, GenerateTokenService],
  exports: [GenerateTokenService]
})
export class AuthModule {}
