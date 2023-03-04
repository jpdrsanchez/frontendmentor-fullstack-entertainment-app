import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'
import * as request from 'supertest'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import { PrismaClient } from '@prisma/client'

describe('Viewers (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaClient

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
    prisma = new PrismaClient()
  })

  afterEach(async () => {
    const deleteViewers = prisma.viewer.deleteMany()
    const deleteImages = prisma.image.deleteMany()
    await prisma.$transaction([deleteViewers, deleteImages])

    await prisma.$disconnect()
  })

  afterAll(async () => {
    await app.close()
    await fs.rm(path.join(process.cwd(), process.env.UPLOADS_DIR), {
      force: true,
      recursive: true
    })
  })

  describe('viewers/ (POST)', () => {
    it('should be able to create a new valid viewer', async () => {
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

      expect(response.body).toStrictEqual({
        id: viewer.id,
        name: viewer.name,
        email: viewer.email,
        avatar: {
          thumbnail: viewer.avatar.metadata
        }
      })
    })
  })
})
