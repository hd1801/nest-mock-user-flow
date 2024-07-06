import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import pg from 'pg';

import { models } from './models';

@Module({})
export class DatabaseModule {
  static forFeature(providers: Provider<any>[] = []): DynamicModule {
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              dialect: 'postgres',
              dialectModule: pg,
              host: configService.get('DATABASE_HOST'),
              port: +configService.get('DATABASE_PORT'),
              username: configService.get('DATABASE_USERNAME'),
              password: configService.get('DATABASE_PASSWORD'),
              database: configService.get('DATABASE_NAME'),
              models: models,
              autoLoadModels: true,
              logging: console.log,
            };
          },
          inject: [ConfigService],
        }),
      ],
    };
  }
}
