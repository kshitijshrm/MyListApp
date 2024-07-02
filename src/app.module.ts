import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConstants } from './common/constants/redis.constants';
import { redisStore } from 'cache-manager-ioredis-yet';
import { GlobalCustomCacheInterceptor } from './common/interceptor/global.cache.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        (process.env.f_stage ?? 'local') === 'local'
          ? '.env.local'
          : '.env.cloud',
      isGlobal: true,
    }),
    SubscriptionModule,
    HealthModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (cs: ConfigService) => ({
        store: await redisStore({
          ttl: RedisConstants.one_day_in_milli_seconds,
          clusterConfig: {
            nodes: (
              (cs.get('REDIS_CLUSTER_MULTI_HOST') as string) ||
              cs.get('REDIS_CLUSTER_HOST')
            )
              .split(',')
              .map((host) => ({
                host: host.trim(),
                port: parseInt(cs.get('REDIS_CLUSTER_PORT') as string, 10),
              })),
            options: {
              redisOptions: {
                password: cs.get('REDIS_CLUSTER_PASSWORD'),
                maxRetriesPerRequest:
                  parseInt(cs.get('REDIS_RETRIES') as string, 10) || 3,
                tls:
                  cs.get('f_stage') != 'local'
                    ? {
                        servername: cs.get('REDIS_CLUSTER_HOST'),
                        minVersion: 'TLSv1.2',
                        rejectUnauthorized: false,
                      }
                    : undefined,
              },
              slotsRefreshTimeout: 10000,
              slotsRefreshInterval: 50000,
              keyPrefix: cs.get('f_redis_namespace'),
            },
          },
        }),
      }),
      inject: [ConfigService],
    }),
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
