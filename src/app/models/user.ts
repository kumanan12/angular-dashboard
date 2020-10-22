import { BaseModel } from './base-model';
import { Player } from './Player';

export class User extends BaseModel{
  identityProvider: string;
  userId: string;
  userRoles: Array<string>;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  players: Array<Player>;
}


