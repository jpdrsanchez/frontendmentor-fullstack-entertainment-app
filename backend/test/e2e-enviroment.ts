import NodeEnvironment from 'jest-environment-node'
import * as child_process from 'node:child_process'
import * as util from 'node:util'

const execSync = util.promisify(child_process.exec)

export default class E2EEnvironment extends NodeEnvironment {
  async setup() {
    try {
      await execSync(`npx env-cmd -f .env.test prisma migrate deploy`)
    } finally {
      super.setup()
    }
  }

  async teardown() {
    super.teardown()
  }
}
