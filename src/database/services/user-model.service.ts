import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';

import { UserModel } from '../models';
import { User, UserAttributes } from '../types';
import { BaseService } from './base.service';

@Injectable()
export class UserModelService extends BaseService<
  UserModel,
  User,
  UserAttributes
> {
  repository: Repository<UserModel>;

  constructor(public readonly sequelize: Sequelize) {
    super();
    this.repository = sequelize.getRepository(UserModel);
  }
}
