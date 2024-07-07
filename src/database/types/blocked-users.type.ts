import { Optional } from 'sequelize';
import { User } from './user.type';

export interface BlockedUser {
  id: number;
  UserId: number;
  BlockedUserId: number;
  blockedUser: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedUserAttributes
  extends Optional<
    BlockedUser,
    'id' | 'blockedUser' | 'createdAt' | 'updatedAt'
  > {}

export const BlockedUserFields = {
  id: 'id',
  UserId: 'UserId',
  BlockedUserId: 'BlockedUserId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};
