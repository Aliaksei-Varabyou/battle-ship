import { createHash, randomUUID } from 'node:crypto';
import { UserType } from "./types";

class battleshipDB {
  private users = new Map<string, UserType>;

  public createUser = (regUser: any): UserType => {
    const password = createHash('sha256').update(regUser.password).digest('hex');
    const id = randomUUID();
    const newUser:UserType =  {
      id,
      name: regUser.name,
      password,
      roomId: '',
      wins: 0,
    };
    this.users.set(id, newUser);
    return newUser;
  };

};

export const db = new battleshipDB();
