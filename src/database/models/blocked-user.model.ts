import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BlockedUser, BlockedUserAttributes, User } from '../types';
import { UserModel } from './user.model';

export const BLOCKED_USER_TABLE_NAME = 'BlockedUser';

@Table({
  tableName: BLOCKED_USER_TABLE_NAME,
  modelName: BLOCKED_USER_TABLE_NAME,
})
export class BlockedUserModel extends Model<
  BlockedUser,
  BlockedUserAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column
  UserId: number;

  @AllowNull(false)
  @ForeignKey(() => UserModel)
  @Column
  BlockedUserId: number;

  @BelongsTo(() => UserModel, 'UserId')
  blockedUser: User | null;

  @Column(DataType.DATE)
  @CreatedAt
  createdAt: string;

  @Column(DataType.DATE)
  @UpdatedAt
  updatedAt: string;
}
