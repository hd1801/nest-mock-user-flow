import { Module } from '@nestjs/common';
import { BlockedUserModelService, DatabaseModule } from 'src/database';
import { RedisModule } from 'src/redis';
import { BlockedUsersController } from './block-user.controller';
import { BlockedUsersService } from './block-user.service';

@Module({
  imports: [RedisModule, DatabaseModule.forFeature([BlockedUserModelService])],
  providers: [BlockedUsersService],
  controllers: [BlockedUsersController],
})
export class BlockUsersModule {}
