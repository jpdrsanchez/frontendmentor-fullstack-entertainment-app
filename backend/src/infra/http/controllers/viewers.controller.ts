import {
  CreateImageUseCase,
  CreateImageUseCaseResponse
} from '@application/use-cases/create-image.usecase'
import { CreateViewerUseCase } from '@application/use-cases/create-viewer.usecase'
import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import {
  ImageUploadService,
  ImageUploadServiceResponse
} from '@infra/upload/images/image-upload.service'
import { CreateViewerDto } from '../dtos/create-viewer.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { ImageConfiguration } from '@config/images.config'
import { ApplicationExceptionPresenter } from '@presenters/exceptions/application.exception'
import { CreateViewerViewModel } from '@presenters/view-models/create-viewer.view-model'

@Controller('viewers')
export class ViewersController {
  constructor(
    private readonly createViewer: CreateViewerUseCase,
    private readonly createImage: CreateImageUseCase,
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
    let imageMetaOrErrorOrNull: ImageUploadServiceResponse | null = null
    let imageOrErrorOrNull: CreateImageUseCaseResponse | null = null

    if (avatar)
      imageMetaOrErrorOrNull = await this.imageUploadService.execute({
        extension: avatar.mimetype.replace('image/', '').trim(),
        filePath: avatar.path,
        sizes: ['avatar'],
        uploadDir:
          this.configService.get<ImageConfiguration>('images').uploadsDir
      })

    if (imageMetaOrErrorOrNull.isLeft()) throw imageMetaOrErrorOrNull.value
    else if (imageMetaOrErrorOrNull.isRight()) {
      imageOrErrorOrNull = await this.createImage.execute({
        name: avatar.originalname,
        description: '',
        extension: avatar.mimetype.replace('image/', '').trim(),
        metadata: imageMetaOrErrorOrNull.value
      })

      if (imageOrErrorOrNull.isLeft())
        throw ApplicationExceptionPresenter.toHttp(imageOrErrorOrNull.value)
    }

    const viewerOrError = await this.createViewer.execute({
      name: createViewerDto.name,
      email: createViewerDto.email,
      password: createViewerDto.password,
      ...(imageOrErrorOrNull.isRight() && { image: imageOrErrorOrNull.value })
    })

    if (viewerOrError.isLeft())
      throw ApplicationExceptionPresenter.toHttp(viewerOrError.value)

    return CreateViewerViewModel.toHttp(
      viewerOrError.value,
      imageOrErrorOrNull.isRight() ? imageOrErrorOrNull.value : null
    )
  }
}
