import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [], // Don't import CacheModule here, it's already imported globally in AppModule
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheServiceModule { }
