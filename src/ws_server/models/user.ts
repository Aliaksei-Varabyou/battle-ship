import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  password: string;
}

class UserDB {
  private users: User[] = [];

  public createUser = (
    name: string,
    password: string,
    id: string,
  ): User => {
    const newUser: User = {
      id: uuidv4(),
      name,
      password,
    };

    this.users.push(newUser);
    return newUser;
  };

  public getUserById = (id: string): User | undefined => {
    return this.users.find((user) => user.id === id);
  };

  public deleteUser = (id: string): boolean => {
    const deletedIndex = this.users.findIndex((user) => user.id === id);
    if (deletedIndex === -1) return false;

    this.users.splice(deletedIndex, 1);
    return true;
  };
}

export const userDb = new UserDB();
