import { ImageProps, Metadata } from '@domain/entities/image.entity'
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnsupportedMediaTypeException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'node:fs/promises'
import * as sharp from 'sharp'
import * as crypto from 'node:crypto'
import * as utils from 'node:util'
import * as path from 'node:path'
import { Either, left, right } from '@core/logic/either.core'
import { ImageConfiguration, ImageThumbnails } from '@config/images.config'

export type ImageUploadMetadataPayload = Omit<Metadata, 'url'>

export interface ImageUploadServiceRequest {
  filePath: string
  uploadDir: string
  sizes: Array<keyof ImageThumbnails<unknown>>
  extension: string
}

export type ImageUploadServiceResponse = Either<
  UnsupportedMediaTypeException | HttpException,
  ImageProps['metadata']
>

@Injectable()
export class ImageUploadService {
  constructor(private readonly configService: ConfigService) {}

  private async validateOrCreateUploadDir(dirname: string) {
    try {
      await fs.access(dirname, fs.constants.F_OK)
    } catch {
      await fs.mkdir(dirname)
    }
  }

  private async resize(
    thumbnails: Array<keyof ImageThumbnails<unknown>>,
    pathname: string
  ) {
    const configuration = this.configService.get<ImageConfiguration>('images')
    const image = sharp(pathname).toFormat(
      configuration.allowWebp ? 'webp' : 'jpg',
      { quality: configuration.optimizationQuality }
    )
    const metadata = await sharp(pathname).metadata()

    let thumbnailResponse: ImageProps['metadata'] = {}

    for (const thumbnail of thumbnails) {
      const finalName = (await utils.promisify(crypto.randomBytes)(8)).toString(
        'hex'
      )
      const sizes = configuration.thumbnail[thumbnail]
      let sizeResponse: Partial<
        Record<'small' | 'medium' | 'large', Metadata>
      > = {}

      for (const size in sizes) {
        if (
          metadata.width >= configuration.thumbnail[thumbnail][size].width &&
          metadata.height >= configuration.thumbnail[thumbnail][size].height
        ) {
          const imagePath = await image
            .clone()
            .resize(
              configuration.thumbnail[thumbnail][size].width,
              configuration.thumbnail[thumbnail][size].height
            )
            .toFile(
              path.join(
                configuration.uploadsDir,
                `${finalName}-${thumbnail}-${size}.${
                  configuration.allowWebp ? 'webp' : 'jpg'
                }`
              )
            )

          sizeResponse = {
            ...sizeResponse,
            [size]: {
              height: imagePath.height,
              width: imagePath.width,
              url: `${finalName}-${thumbnail}-${size}.${
                configuration.allowWebp ? 'webp' : 'jpg'
              }`
            }
          }
        }
      }
      thumbnailResponse = { ...thumbnailResponse, [thumbnail]: sizeResponse }
    }

    return thumbnailResponse
  }

  public async execute(
    request: ImageUploadServiceRequest
  ): Promise<ImageUploadServiceResponse> {
    await this.validateOrCreateUploadDir(request.uploadDir)
    if (
      !this.configService
        .get<ImageConfiguration>('images')
        .allowedFiles.includes(request.extension)
    )
      return left(new UnsupportedMediaTypeException())

    try {
      const response = (await this.resize(
        request.sizes,
        request.filePath
      )) as ImageProps['metadata']

      fs.unlink(request.filePath)

      return right(response)
    } catch (error) {
      return left(
        new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message:
              error.message ?? 'An error occurred while processing the request',
            error: 'Bad Request'
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: new Error(
              error.message ?? 'An error occurred while processing the request'
            ),
            description:
              error.message ?? 'An error occurred while processing the request'
          }
        )
      )
    }
  }
}
