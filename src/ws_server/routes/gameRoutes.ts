import { TYPE_ATTACK, TYPE_CREATE_GAME, TYPE_FINISH, TYPE_START_GAME, TYPE_TURN } from "../constants";
import { handleServerError } from "../controller";
import { WSRequest } from "../interfaces";

export const handleRequestGame = (request: WSRequest): void => {
  try {
    switch (request.type) {
      case TYPE_CREATE_GAME:
        console.log('create game');
        break;
      case TYPE_START_GAME:
        console.log('start game');
        break;
      case TYPE_ATTACK:
        console.log('attack');
        break;
      case TYPE_TURN:
        console.log('turn');
        break;
      case TYPE_FINISH:
        console.log('finish');
        break;
    }
  } catch (error) {
    handleServerError(request, error);
  }
};
