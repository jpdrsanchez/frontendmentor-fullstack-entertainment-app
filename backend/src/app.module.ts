import { Module } from '@nestjs/common'
import { DatabaseModule } from './infra/database/database.module'
import { UploadsModule } from './infra/upload/upload.module'

@Module({
  imports: [DatabaseModule, UploadsModule],
  controllers: [],
  providers: []
})
export class AppModule {}
