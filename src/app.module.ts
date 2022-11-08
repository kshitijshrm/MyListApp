import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { SubscriptionModule } from './subscription/subscription.module';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
