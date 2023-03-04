import { InvalidEmailException } from '@domain/entities/value-objects/exceptions/invalid-email.exception'
import { InvalidNameException } from '@domain/entities/value-objects/exceptions/invalid-name.exception'
import { InvalidPasswordException } from '@domain/entities/value-objects/exceptions/invalid-password.exception'
import { Viewer } from '@domain/entities/viewer.entity'
import { faker } from '@faker-js/faker'
import { CreateViewerService } from './create-viewer.service'

describe('CreateViewer Domain Service', () => {
  it('should be able to create a viewer domain entity', async () => {
    const name = 'Dummy Name'
    const email = 'dummy@example.com'
    const password = 'fGh76432%$#*kJPoyTER'

    const createdViewer = await CreateViewerService.execute({
      name,
      email,
      password
    })

    const viewer = createdViewer.value as Viewer

    expect(createdViewer.isRight()).toBe(true)
    expect(createdViewer.value).toBeInstanceOf(Viewer)
    expect(viewer.name).toBe(name)
    expect(viewer.email).toBe(email)
    expect(await viewer.password.compare(password)).toBe(true)
  })

  it('should not be able to create a viewer with invalid value objects', async () => {
    const password = 'fGh76432%$#*kJPoyTER'

    const viewerWithInvalidName = await CreateViewerService.execute({
      name: '',
      email: faker.internet.email(),
      password
    })
    const viewerWithInvalidEmail = await CreateViewerService.execute({
      name: faker.name.fullName(),
      email: '',
      password
    })
    const viewerWithInvalidPassword = await CreateViewerService.execute({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password: ''
    })

    expect(viewerWithInvalidName.isLeft()).toBe(true)
    expect(viewerWithInvalidName.value).toBeInstanceOf(InvalidNameException)
    expect(viewerWithInvalidEmail.isLeft()).toBe(true)
    expect(viewerWithInvalidEmail.value).toBeInstanceOf(InvalidEmailException)
    expect(viewerWithInvalidPassword.isLeft()).toBe(true)
    expect(viewerWithInvalidPassword.value).toBeInstanceOf(
      InvalidPasswordException
    )
  })
})
