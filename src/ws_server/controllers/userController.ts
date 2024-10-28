import { db } from '../../db/db';
import { UserDBType } from '../../db/types';
import { UserResponseData } from '../interfaces';
import { MyWebSocket } from '../MyWebSocket';
import { validateUser } from '../services/userService';

export const regUser = (ws: MyWebSocket, data: any): UserResponseData => {
  let response = {
    name: '',
    index: '',
    error: true,
    errorText: '',
  }
  if (validateUser(data)) {
    const newUser = db.createUser(ws, data);
    response =  {
      name: newUser.name,
      index: newUser.id,
      error: false,
      errorText: '',
    }
  }
  return response;
};

export const addGame2User = (user: UserDBType, gameId: string | number): void => {
  db.addGame2User(user.id, gameId.toString());
};

export const getWsMapResponses = (responses: any[], userField: string): Map<MyWebSocket, any> => {
  const wsWithUsers = db.getAllWebsocketsWithUsers();
  let result: Map<MyWebSocket, any> = new Map<MyWebSocket, any>;

  responses.forEach((response) => {
    if (response?.[userField]) {
      wsWithUsers.forEach((user, ws) => {
        if (response?.[userField] === (user.id)) {
          result.set(ws, response);
        }
      });
    }
  });
  return result;
};
