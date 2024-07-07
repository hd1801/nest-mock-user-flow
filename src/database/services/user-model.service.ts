import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';

import { User, UserAttributes } from '../types';
import { BaseService } from './base.service';
import { UserModel } from '../models';

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
