import { db } from '../../db/db';
import { UserResponseData } from '../interfaces';
import { validateUser } from '../services/userService';

export const regUser = (data: any): UserResponseData => {
  let response = {
    name: '',
    index: '',
    error: true,
    errorText: '',
  }
  if (validateUser(data)) {
    const newUser = db.createUser(data);
    response =  {
      name: newUser.name,
      index: newUser.id,
      error: false,
      errorText: '',
    }
  }
  return response;
};
