import { CreateImageUseCase } from '@application/use-cases/create-image.usecase'
import { CreateViewerUseCase } from '@application/use-cases/create-viewer.usecase'
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ImageUploadService } from '@infra/upload/images/image-upload.service'
import { CreateViewerDto } from '../dtos/create-viewer.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { ImageConfiguration } from '@config/images.config'
import { ApplicationExceptionPresenter } from '@presenters/exceptions/application.exception'
import { CreateViewerViewModel } from '@presenters/view-models/create-viewer.view-model'
import { AttachImageToViewerUseCase } from '@application/use-cases/attach-image-to-viewer.usecase'
import { AuthGuard } from '@infra/auth/guards/jwt.guard'

@Controller('viewers')
export class ViewersController {
  constructor(
    private readonly createViewer: CreateViewerUseCase,
    private readonly createImage: CreateImageUseCase,
    private readonly attachImageToViewer: AttachImageToViewerUseCase,
    private readonly imageUploadService: ImageUploadService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() createViewerDto: CreateViewerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /image\/jpe?g|png|webp/i })
        ],
        fileIsRequired: false
      })
    )
    avatar: Express.Multer.File
  ) {
    const viewerOrError = await this.createViewer.execute({
      name: createViewerDto.name,
      email: createViewerDto.email,
      password: createViewerDto.password
    })
    if (viewerOrError.isLeft())
      throw ApplicationExceptionPresenter.toHttp(viewerOrError.value)

    if (avatar) {
      const imageMetaOrError = await this.imageUploadService.execute({
        extension: avatar.mimetype.replace('image/', '').trim(),
        filePath: avatar.path,
        sizes: ['avatar'],
        uploadDir:
          this.configService.get<ImageConfiguration>('images').uploadsDir
      })
      if (imageMetaOrError.isLeft()) throw imageMetaOrError.value

      const imageOrError = await this.createImage.execute({
        name: avatar.originalname,
        description: '',
        extension: avatar.mimetype.replace('image/', '').trim(),
        metadata: imageMetaOrError.value
      })
      if (imageOrError.isLeft())
        throw ApplicationExceptionPresenter.toHttp(imageOrError.value)

      await this.attachImageToViewer.execute({
        viewer: viewerOrError.value,
        image: imageOrError.value
      })
    }

    return CreateViewerViewModel.toHttp(viewerOrError.value)
  }

  @UseGuards(AuthGuard)
  @Get()
  async me(@Request() request) {
    console.log(request)
    return request.auth
  }
}
