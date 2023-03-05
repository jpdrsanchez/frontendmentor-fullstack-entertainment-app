import globalConfig from '@config/global.config'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { ImageUploadService } from './image-upload.service'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { ImageProps } from '@domain/entities/image.entity'
import { HttpException, UnsupportedMediaTypeException } from '@nestjs/common'

describe('ImageUpload Service', () => {
  let imageUploadService: ImageUploadService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [globalConfig] })],
      providers: [ImageUploadService]
    }).compile()

    imageUploadService = moduleRef.get<ImageUploadService>(ImageUploadService)

    try {
      await fs.access(
        path.join(process.cwd(), process.env.TMP_DIR),
        fs.constants.F_OK
      )
    } catch {
      await fs.mkdir(path.join(process.cwd(), process.env.TMP_DIR))
    }

    await fs.copyFile(
      path.join(process.cwd(), 'test/utils/images/placeholder.jpg'),
      path.join(process.cwd(), process.env.TMP_DIR, 'placeholder.jpg')
    )
  })

  afterEach(async () => {
    await fs.rm(path.join(process.cwd(), process.env.UPLOADS_DIR), {
      force: true,
      recursive: true
    })
    await fs.rm(path.join(process.cwd(), process.env.TMP_DIR), {
      force: true,
      recursive: true
    })
  })

  it('should be able to resize the provided image correctly', async () => {
    let response = await imageUploadService.execute({
      extension: 'jpg',
      filePath: path.join(
        process.cwd(),
        process.env.TMP_DIR,
        'placeholder.jpg'
      ),
      sizes: ['avatar'],
      uploadDir: path.join(process.cwd(), process.env.UPLOADS_DIR)
    })

    let metadata = response.value as ImageProps['metadata']
    const [metadataToArray] = Object.values(metadata).map(item =>
      Object.values(item).map(meta => meta.url)
    )

    let uploadsDir = await fs.readdir(
      path.join(process.cwd(), process.env.UPLOADS_DIR)
    )

    expect(response.isRight()).toBe(true)
    expect(metadata.avatar).toBeDefined()
    expect(metadata.trending).not.toBeDefined()
    expect(metadata.regular).not.toBeDefined()
    expect(uploadsDir).toEqual(expect.arrayContaining(metadataToArray))
    expect(uploadsDir).toHaveLength(3)

    await fs.copyFile(
      path.join(process.cwd(), 'test/utils/images/placeholder.jpg'),
      path.join(process.cwd(), process.env.TMP_DIR, 'placeholder.jpg')
    )

    response = await imageUploadService.execute({
      extension: 'jpg',
      filePath: path.join(
        process.cwd(),
        process.env.TMP_DIR,
        'placeholder.jpg'
      ),
      sizes: ['avatar', 'regular', 'trending'],
      uploadDir: path.join(process.cwd(), process.env.UPLOADS_DIR)
    })

    metadata = response.value as ImageProps['metadata']
    const thumbnailArray = Object.values(metadata)
      .map(item => Object.values(item).map(meta => meta.url))
      .flat()

    uploadsDir = await fs.readdir(
      path.join(process.cwd(), process.env.UPLOADS_DIR)
    )

    expect(response.isRight()).toBe(true)
    expect(metadata.avatar).toBeDefined()
    expect(metadata.trending).toBeDefined()
    expect(metadata.regular).toBeDefined()
    expect(uploadsDir).toEqual(expect.arrayContaining(thumbnailArray))
    expect(uploadsDir).toHaveLength(12)
  })

  it('should throw an error when the image extension is not allowed', async () => {
    const response = await imageUploadService.execute({
      extension: 'gif',
      filePath: path.join(
        process.cwd(),
        process.env.TMP_DIR,
        'placeholder.jpg'
      ),
      sizes: ['avatar'],
      uploadDir: path.join(process.cwd(), process.env.UPLOADS_DIR)
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(UnsupportedMediaTypeException)
  })

  it('should throw an error when the provided file does not exist', async () => {
    const response = await imageUploadService.execute({
      extension: 'png',
      filePath: path.join(
        process.cwd(),
        process.env.TMP_DIR,
        'placeholderr.jpg'
      ),
      sizes: ['avatar'],
      uploadDir: path.join(process.cwd(), process.env.UPLOADS_DIR)
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(HttpException)
  })
})
