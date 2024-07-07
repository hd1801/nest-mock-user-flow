import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/database';
import { MockAuthGuard } from 'src/guards';
import { GetUser } from 'src/utils';
import { CreateUserDto, QueryUsersDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('mock-token')
  getMockToken(@Query('userId') userId: number) {
    return this.userService.getMockToken(userId);
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Get()
  @UseGuards(MockAuthGuard)
  getUsers(@Query() query: QueryUsersDto, @GetUser() user: User) {
    return this.userService.getUsers(query, user?.id);
  }
}
