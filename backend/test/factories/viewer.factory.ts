import { Email } from '@domain/entities/value-objects/email'
import { Name } from '@domain/entities/value-objects/name'
import { Password } from '@domain/entities/value-objects/password'
import { Viewer, ViewerProps } from '@domain/entities/viewer.entity'
import { faker } from '@faker-js/faker'

export const viewerFactory = async (overrides?: Partial<ViewerProps>) => {
  const name = Name.create(faker.name.fullName()).value as Name
  const email = Email.create(faker.internet.email()).value as Email
  const password = (await Password.create('43245@Abcde&*RT5hJiY$'))
    .value as Password

  return Viewer.create({ name, email, password, ...overrides })
}
