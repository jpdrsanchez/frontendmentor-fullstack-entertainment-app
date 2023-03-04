import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'
import * as request from 'supertest'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import { PrismaClient } from '@prisma/client'
import { Metadata } from '@domain/entities/image.entity'

describe('Viewers (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaClient

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      })
    )
    await app.init()
    prisma = new PrismaClient()
  })

  afterEach(async () => {
    const deleteViewers = prisma.viewer.deleteMany()
    const deleteImages = prisma.image.deleteMany()
    await prisma.$transaction([deleteViewers, deleteImages])

    await prisma.$disconnect()
    await fs.rm(path.join(process.cwd(), process.env.UPLOADS_DIR), {
      force: true,
      recursive: true
    })
    await app.close()
  })

  describe('viewers/ (POST)', () => {
    it('should be able to create a new valid viewer with an attached image', async () => {
      const response = await request(app.getHttpServer())
        .post('/viewers')
        .field('name', 'Dummy User')
        .field('email', 'dummy@example.com')
        .field('password', 'eU&$yU9H$e')
        .attach(
          'avatar',
          path.join(process.cwd(), 'test', 'utils', 'images', 'placeholder.jpg')
        )
        .expect(201)

      const viewer = await prisma.viewer.findFirst({
        include: { avatar: true }
      })

      const uploadsDir = await fs.readdir(
        path.join(process.cwd(), process.env.UPLOADS_DIR)
      )
      const tmpDir = await fs.readdir(
        path.join(process.cwd(), process.env.TMP_DIR)
      )
      const thumbnailArray = Object.values(viewer.avatar.metadata)
        .map(item => Object.values(item as Metadata).map(meta => meta.url))
        .flat()

      expect(response.body).toStrictEqual({
        id: viewer.id,
        name: viewer.name,
        email: viewer.email,
        avatar: {
          thumbnail: viewer.avatar.metadata
        }
      })
      expect(uploadsDir).toHaveLength(3)
      expect(uploadsDir).toEqual(expect.arrayContaining(thumbnailArray))
      expect(tmpDir).toHaveLength(1)
    })

    it('should be able to create a new valid viewer without an attached image', async () => {
      const response = await request(app.getHttpServer())
        .post('/viewers')
        .field('name', 'Dummy User')
        .field('email', 'dummy@example.com')
        .field('password', 'eU&$yU9H$e')
        .expect(201)

      const viewer = await prisma.viewer.findFirst({
        include: { avatar: true }
      })

      expect(response.body).toStrictEqual({
        id: viewer.id,
        name: viewer.name,
        email: viewer.email
      })
      expect(viewer.avatar).toBeNull()
    })

    it('should not be able to create a viewer with an existing email, invalid name or password', async () => {
      await request(app.getHttpServer())
        .post('/viewers')
        .field('name', 'Dummy User')
        .field('email', 'dummy@example.com')
        .field('password', 'eU&$yU9H$e')
        .expect(201)

      await request(app.getHttpServer())
        .post('/viewers')
        .field('name', 'Dummy User')
        .field('email', 'dummy@example.com')
        .field('password', 'eU&$yU9H$e')
        .expect(400)

      await request(app.getHttpServer())
        .post('/viewers')
        .field('name', 'Dummy User')
        .field('email', 'dummyTwo@example.com')
        .field('password', 'eU&$y')
        .expect(422)

      await request(app.getHttpServer())
        .post('/viewers')
        .field('name', 'Du')
        .field('email', 'dummyTwo@example.com')
        .field('password', 'eU&$yeU&$y')
        .expect(422)
    })
  })
})
