import { Optional } from 'sequelize';

export interface User {
  id: number;
  name: string;
  surname: string;
  username: string;
  birthdate: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAttributes
  extends Optional<User, 'id' | 'createdAt' | 'updatedAt'> {}

export const UserFields = {
  id: 'id',
  name: 'name',
  surname: 'surname',
  username: 'username',
  birthdate: 'birthdate',
  email: 'email',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};
