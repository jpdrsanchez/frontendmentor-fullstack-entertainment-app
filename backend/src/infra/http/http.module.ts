import { AttachImageToViewerUseCase } from '@application/use-cases/attach-image-to-viewer.usecase'
import { CreateImageUseCase } from '@application/use-cases/create-image.usecase'
import { CreateViewerUseCase } from '@application/use-cases/create-viewer.usecase'
import globalConfig from '@config/global.config'
import { ImagesRepository } from '@domain/repositories/images.repository'
import { ViewersRepository } from '@domain/repositories/viewers.repository'
import { DatabaseModule } from '@infra/database/database.module'
import { PrismaImagesRepository } from '@infra/database/prisma/repositories/prisma-images.repository'
import { PrismaViewersRepository } from '@infra/database/prisma/repositories/prisma-viewers.repository'
import { UploadsModule } from '@infra/upload/upload.module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import * as path from 'node:path'
import { ViewersController } from './controllers/viewers.controller'

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: path.join(process.cwd(), configService.get<string>('TMP_DIR'))
      }),
      inject: [ConfigService]
    }),
    UploadsModule,
    DatabaseModule,
    ConfigModule.forRoot({ load: [globalConfig] })
  ],
  controllers: [ViewersController],
  providers: [
    PrismaViewersRepository,
    PrismaImagesRepository,
    {
      provide: CreateViewerUseCase,
      useFactory: (viewersRepository: ViewersRepository) => {
        return new CreateViewerUseCase(viewersRepository)
      },
      inject: [PrismaViewersRepository]
    },
    {
      provide: CreateImageUseCase,
      useFactory: (imagesRepository: ImagesRepository) => {
        return new CreateImageUseCase(imagesRepository)
      },
      inject: [PrismaImagesRepository]
    },
    {
      provide: AttachImageToViewerUseCase,
      useFactory: (viewersRepository: ViewersRepository) => {
        return new AttachImageToViewerUseCase(viewersRepository)
      },
      inject: [PrismaViewersRepository]
    }
  ]
})
export class HttpModule {}
