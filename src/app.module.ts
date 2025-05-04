import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConstants } from './common/constants/redis.constants';
import { GlobalCustomCacheInterceptor } from './common/interceptor/global.cache.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { MyListModule } from './list/my-list.module';
import { CacheServiceModule } from './common/services/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        (process.env.f_stage ?? 'local') === 'local'
          ? '.env.local'
          : '.env.cloud',
      isGlobal: true,
    }),
    HealthModule,
    CacheModule.register({
      isGlobal: true,
      ttl: RedisConstants.one_day_in_seconds, // default TTL in seconds
    }),
    DatabaseModule,
    MyListModule,
    CacheServiceModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalCustomCacheInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
