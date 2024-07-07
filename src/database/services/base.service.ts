import { Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import {
  Attributes,
  FindAndCountOptions,
  FindOptions,
  Model,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { Repository } from 'sequelize-typescript';

const humanizeTableName = (name: string) => name.toLowerCase();

@Injectable()
export abstract class BaseService<
  T extends Model,
  K,
  C extends T['_creationAttributes'],
> {
  protected abstract repository: Repository<T>;

  getHumanizedTableName = () => humanizeTableName(this.repository.tableName);

  NotFoundError = () =>
    new Error(`${this.getHumanizedTableName()} not found`) as unknown as Error;

  public plainEntityGetter = <T>(entity: Model<T>) =>
    entity && (entity.get({ plain: true }) as unknown as T);

  public plainEntitiesGetter = <T>(entities: Array<Model<T>>) =>
    entities && entities.length ? entities.map(this.plainEntityGetter) : [];

  public async add(entity: C, transaction?: Transaction) {
    return this.repository
      .create(entity, { transaction, returning: true })
      .then(this.plainEntityGetter<K>);
  }

  public async addMultiple(entities: C[], transaction?: Transaction) {
    return this.repository
      .bulkCreate(entities, { transaction })
      .then(this.plainEntitiesGetter<K>);
  }

  public async getAllWhere(
    entitiesFilter: WhereOptions<K>,
    transaction?: Transaction,
    findOptions?: FindOptions<K>,
  ): Promise<K[]> {
    return this.repository
      .findAll({ where: entitiesFilter, transaction, ...findOptions })
      .then(this.plainEntitiesGetter<K>);
  }

  public async getAll(transaction?: Transaction, findOptions?: FindOptions<K>) {
    return this.repository
      .findAll({ transaction, ...findOptions })
      .then(this.plainEntitiesGetter);
  }

  public async get(
    id: number,
    transaction?: Transaction,
    findOptions?: FindOptions<K>,
  ): Promise<K> {
    return this.repository
      .findByPk(id, {
        transaction,
        ...findOptions,
      })
      .then(this.plainEntityGetter);
  }

  public async getOneWhere(
    entitiesFilter: WhereOptions<K>,
    transaction?: Transaction,
    findOptions?: FindOptions<K>,
  ): Promise<K> {
    return this.repository
      .unscoped()
      .findOne({
        where: entitiesFilter,
        transaction,
        ...findOptions,
      })
      .then(this.plainEntityGetter);
  }

  public async updateOne(
    entity: Partial<K>,
    transaction?: Transaction,
    findOptions?: FindOptions<K>,
  ) {
    return this.repository
      .findByPk((entity as any).id, {
        rejectOnEmpty: this.NotFoundError(),
        transaction,
        ...findOptions,
      })
      .then((savedEntity) => {
        return savedEntity
          .update(entity, { transaction })
          .then(this.plainEntityGetter<K>);
      });
  }

  public async updateWhere(
    entity: Partial<K>,
    entitiesFilter: WhereOptions<K>,
    transaction?: Transaction,
    findOptions?: FindOptions<K>,
  ) {
    return this.repository
      .update(entity, {
        where: entitiesFilter,
        transaction,
        ...findOptions,
        returning: true,
      })
      .then((updateRowAndEntities) =>
        this.plainEntitiesGetter<K>(updateRowAndEntities[1]),
      );
  }

  public async removeOne(id: number, transaction?: Transaction) {
    return this.repository
      .findByPk(id, {
        rejectOnEmpty: this.NotFoundError(),
        transaction,
      })
      .then(async (entity) => {
        await entity.destroy({ transaction });
        return this.plainEntityGetter<K>(entity);
      });
  }

  public async alreadyExists(id: number, transaction?: Transaction) {
    return !!(await this.repository.findByPk(id, { transaction }));
  }

  public async alreadyExistsWhere(
    entity: WhereOptions<K>,
    transaction?: Transaction,
    findOptions?: FindOptions<Attributes<T>>,
  ) {
    return !!(await this.repository.findOne({
      where: entity,
      transaction,
      ...findOptions,
    }));
  }

  public async removeWhere(
    entityFilter: WhereOptions<K>,
    transaction?: Transaction,
    findOptions?: FindOptions<K>,
  ) {
    return this.repository
      .findAll({ transaction, where: entityFilter, ...findOptions })
      .then(async (entities) => {
        await this.repository.destroy({
          transaction,
          ...findOptions,
        });
        return this.plainEntitiesGetter<K>(entities);
      });
  }

  public async getCountWhere(
    whereOptions: WhereOptions<K>,
    transaction?: Transaction,
    findOptions?: FindOptions<K>,
  ) {
    return this.repository.count({
      where: whereOptions,
      transaction,
      ...findOptions,
    });
  }

  async getOrThrow(
    id: number,
    transaction?: Transaction,
    findOptions?: FindOptions,
    exception?: NotFoundException,
  ) {
    const entity = await this.get(id, transaction, findOptions);
    if (!entity) {
      if (exception) {
        throw exception instanceof NotFoundException;
      }
      throw new NotFoundException('Does Not exist');
    }
    return entity;
  }
}
