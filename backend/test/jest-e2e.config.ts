import { Config } from 'jest'
import jestConfig from '../jest.config'

const config: Config = {
  ...jestConfig,
  testRegex: '.e2e-spec.ts$',
  rootDir: '../',
  testEnvironment: '<rootDir>/test/e2e-enviroment.ts'
}

export default config
