import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryUsersDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minAge: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAge: number;
}
