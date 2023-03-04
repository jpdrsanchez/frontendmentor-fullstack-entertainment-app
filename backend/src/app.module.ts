import { Module } from '@nestjs/common'
import { DatabaseModule } from './infra/database/database.module'
import { UploadsModule } from './infra/upload/upload.module'
import { HttpModule } from './infra/http/http.module'

@Module({
  imports: [DatabaseModule, UploadsModule, HttpModule],
  controllers: [],
  providers: []
})
export class AppModule {}
