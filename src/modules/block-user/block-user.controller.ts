import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BlockedUsersService } from './block-user.service';
import { MockAuthGuard } from 'src/guards';
import { GetUser } from 'src/utils';
import { User } from 'src/database';

@Controller('blocked-users')
export class BlockedUsersController {
  constructor(private readonly blockedUsersService: BlockedUsersService) {}

  @Post(':userId')
  @UseGuards(MockAuthGuard)
  blockUser(
    @Param('userId', ParseIntPipe) blockedUserId: number,
    @GetUser() user: User,
  ) {
    return this.blockedUsersService.blockUser(user.id, blockedUserId);
  }

  @Delete(':userId')
  @UseGuards(MockAuthGuard)
  unblockUser(
    @Param('userId', ParseIntPipe) blockedUserId: number,
    @GetUser() user: User,
  ) {
    return this.blockedUsersService.unblockUser(user.id, blockedUserId);
  }
}
