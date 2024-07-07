import { BadRequestException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Op } from 'sequelize';
import { BlockedUserModelService, UserModelService } from 'src/database';
import { RedisProvider } from 'src/redis';
import { CreateUserDto, QueryUsersDto } from './dto';
import { getBlockedUsersCacheKey, getSearchCacheKey } from 'src/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly userModelService: UserModelService,
    private readonly jwtService: JwtService,
  ) {}

  createUser(user: CreateUserDto) {
    return this.userModelService.sequelize.transaction(async (transaction) => {
      // check if user with same username exists
      const existingUser = await this.userModelService.getOneWhere(
        {
          username: user.username,
        },
        transaction,
      );
      if (existingUser) {
        throw new BadRequestException('User with same username already exists');
      }
      return this.userModelService.add(
        {
          ...user,
          birthdate: moment(user.birthdate).toDate().toISOString(),
        },
        transaction,
      );
    });
  }

  getMockToken(userId: number) {
    return this.jwtService.sign(
      { sub: userId },
      {
        expiresIn: undefined,
      },
    );
  }

  async getUsers(query: QueryUsersDto, userId: number) {
    const users = await this.getUsersFromCache(query, userId);
    if (users) {
      return users;
    }
    return this.getUsersFromDatabase(query, userId);
  }

  //get  search users from cache
  async getUsersFromCache(query: QueryUsersDto, userId: number) {
    const { maxAge, minAge, username } = query;
    const cacheKey = getSearchCacheKey(username, maxAge, minAge, null);
    const users = await this.redisProvider.get(cacheKey);
    if (users) {
      const usersArr = JSON.parse(users);
      if (usersArr.length) return usersArr;
    }
    return null;
  }

  async getUsersFromDatabase(query: QueryUsersDto, userId: number) {
    const whereOptions = this.getSearchWhereOptions(query, userId);
    const users = await this.userModelService.getAllWhere(whereOptions);
    const cacheKey = getSearchCacheKey(
      query.username,
      query.maxAge,
      query.minAge,
      null,
    );
    await this.redisProvider.set(cacheKey, JSON.stringify(users));
    return users;
  }

  async getBlockedUserIds(userId: number) {
    const cachekey = getBlockedUsersCacheKey(userId);
    const blockedUserIds = await this.redisProvider.get(cachekey);
    if (blockedUserIds) {
      return JSON.parse(blockedUserIds);
    }
    return [];
  }

  getSearchWhereOptions(query: QueryUsersDto, userId: number) {
    const { maxAge, minAge, username } = query;
    const maxDate = moment().subtract(maxAge, 'years').toDate().toISOString();
    const minDate = moment().subtract(minAge, 'years').toDate().toISOString();
    const blockedUserIds = this.getBlockedUserIds(userId);
    const whereOptions: any = {};

    // Check if username is provided and add to where options
    if (username) {
      whereOptions.username = {
        [Op.like]: `%${username}%`,
      };
    }

    // Check if minDate and maxDate are provided and add to where options
    if (minAge && maxAge) {
      whereOptions.birthdate = {
        [Op.gte]: maxDate,
        [Op.lte]: minDate,
      };
    } else if (minAge) {
      whereOptions.birthdate = {
        [Op.gte]: minDate,
      };
    } else if (maxAge) {
      whereOptions.birthdate = {
        [Op.lte]: maxDate,
      };
    }
    whereOptions.id = {
      [Op.notIn]: blockedUserIds || [],
    };
    return whereOptions;
  }
}
