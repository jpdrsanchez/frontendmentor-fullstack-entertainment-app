import { Module } from '@nestjs/common'
import { ImageUploadService } from './images/image-upload.service'
import { ConfigModule } from '@nestjs/config'
import globalConfig from '@config/global.config'

@Module({
  providers: [ImageUploadService],
  imports: [ConfigModule.forRoot({ load: [globalConfig] })]
})
export class UploadsModule {}
