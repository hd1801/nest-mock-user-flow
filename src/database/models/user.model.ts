import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User, UserAttributes } from '../types';

export const USER_TABLE_NAME = 'User';

@Table({
  tableName: USER_TABLE_NAME,
  modelName: USER_TABLE_NAME,
})
export class UserModel extends Model<User, UserAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  surname: string;

  @Column
  username: string;

  @Column
  birthdate: string;

  @Column
  email: string;

  @Column(DataType.DATE)
  @CreatedAt
  createdAt: string;

  @Column(DataType.DATE)
  @UpdatedAt
  updatedAt: string;
}
