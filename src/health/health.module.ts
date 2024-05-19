import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';

@Module({
  imports: [TerminusModule, RedisHealthModule, HttpModule],
  controllers: [HealthController],
})
export class HealthModule {}
