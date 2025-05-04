import { Module } from '@nestjs/common';
import { MyListController } from './my-list.controller';
import { MyListService } from './my-list.service';
import { DatabaseModule } from '../database/database.module';
import { CacheServiceModule } from '../common/services/cache.module';

@Module({
  imports: [
    DatabaseModule,
    CacheServiceModule
  ],
  controllers: [MyListController],
  providers: [MyListService],
  exports: [MyListService]
})
export class MyListModule { }
