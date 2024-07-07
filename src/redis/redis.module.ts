import { Module } from '@nestjs/common';
import { RedisProvider } from './redis.service';

@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
