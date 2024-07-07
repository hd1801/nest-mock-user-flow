import { Module } from '@nestjs/common';
import { DatabaseModule, UserModelService } from 'src/database';
import { RedisModule } from 'src/redis';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [RedisModule, DatabaseModule.forFeature([UserModelService])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
