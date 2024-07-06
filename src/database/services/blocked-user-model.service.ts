import { Injectable } from '@nestjs/common';
import { Repository, Sequelize } from 'sequelize-typescript';

import { BlockedUserModel } from '../models';
import { BlockedUser, BlockedUserAttributes } from '../types';
import { BaseService } from './base.service';

@Injectable()
export class BlockedUserModelService extends BaseService<
  BlockedUserModel,
  BlockedUser,
  BlockedUserAttributes
> {
  repository: Repository<BlockedUserModel>;

  constructor(public readonly sequelize: Sequelize) {
    super();
    this.repository = sequelize.getRepository(BlockedUserModel);
  }
}
