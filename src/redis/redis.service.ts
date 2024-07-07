import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redis from 'ioredis';

@Injectable()
export class RedisProvider {
  public redisClient: redis.Redis;

  constructor(private readonly configService: ConfigService) {
    this.setupRedis();
  }

  async setupRedis() {
    this.redisClient = new redis.Redis({
      port: +this.configService.get('REDIS_PORT'),
      host: this.configService.get('REDIS_HOST'),
    });

    if (!this.redisClient) await this.redisClient.connect();

    this.redisClient.on('error', (err) => {
      console.log('Redis error: ' + err);
    });
  }

  async getNewRedisClient() {
    const redisClient = redis.Redis.createClient();
    redisClient.options.host = process.env['REDIS_HOST'];
    redisClient.options.port = +process.env['REDIS_PORT'];
    return redisClient;
  }

  /**
   * @param key
   * @returns {Promise<string>}
   * @Description Get value from redis by key
   */
  async get(key: string) {
    return this.redisClient.get(key);
  }

  /**
   * @param key
   * @param value
   * @returns {Promise<string>}
   * @Description Sets value in redis by key
   */
  async set(key: string, value: string) {
    return this.redisClient.set(key, value);
  }

  /**
   * @param key
   * @param value
   * @param expire
   * @returns {Promise<string>}
   * @Description Sets value in redis by key with expiration
   */
  async setWithExpire(key: string, value: string, expire: number) {
    return this.redisClient.set(key, value, 'EX', expire);
  }

  /**
   * @param key
   * @returns {Promise<number>}
   * @Description Deletes value from redis by key
   */
  async del(key: string) {
    return this.redisClient.del(key);
  }

  /**
   * @param key
   * @returns {Promise<number>}
   * @Description Checks if key exists in redis
   */
  async exists(key: string) {
    return this.redisClient.exists(key);
  }
}
