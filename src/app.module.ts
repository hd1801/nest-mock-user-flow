import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { BlockUsersModule } from './modules';
import { UsersModule } from './modules/users/users.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Path to your .env file
    }),
    UsersModule,
    RedisModule,
    BlockUsersModule,
    JwtModule.register({
      global: true,
      secret: 'secretKey',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
