import { Module } from '@nestjs/common';
import { DatabaseModule, UserModelService } from 'src/database';
import { RedisModule } from 'src/redis';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RedisModule,
    DatabaseModule.forFeature([UserModelService]),
    JwtModule.register({
      secret: 'secretKey',
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
