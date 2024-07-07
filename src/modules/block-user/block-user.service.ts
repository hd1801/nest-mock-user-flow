import { Transaction } from 'sequelize';
import { BlockedUserModelService } from 'src/database';
import { RedisProvider } from 'src/redis';
import { getBlockedUsersCacheKey } from 'src/utils';

export class BlockedUsersService {
  constructor(
    private readonly blockedUserModelService: BlockedUserModelService,
    private readonly redisProvider: RedisProvider,
  ) {}

  async blockUser(userId: number, blockedUserId: number) {
    return this.blockedUserModelService.sequelize.transaction(async (t) => {
      const blockedUser = await this.blockedUserModelService.add(
        {
          UserId: userId,
          BlockedUserId: blockedUserId,
        },
        t,
      );
      await this.updateBlockedUsersCache(userId, t);
      return blockedUser;
    });
  }

  async unblockUser(userId: number, blockedUserId: number) {
    return this.blockedUserModelService.sequelize.transaction(async (t) => {
      const unblockUser = await this.blockedUserModelService.removeWhere(
        {
          UserId: userId,
          BlockedUserId: blockedUserId,
        },
        t,
      );
      await this.updateBlockedUsersCache(userId, t);
      return unblockUser;
    });
  }

  async updateBlockedUsersCache(userId: number, t: Transaction) {
    const cacheKey = getBlockedUsersCacheKey(userId);
    const blockedUsers = await this.blockedUserModelService.getAllWhere(
      {
        UserId: userId,
      },
      t,
    );
    const blockedUserIds = blockedUsers.map(
      (blockedUser) => blockedUser.BlockedUserId,
    );
    await this.redisProvider.set(cacheKey, JSON.stringify(blockedUserIds));
  }
}
