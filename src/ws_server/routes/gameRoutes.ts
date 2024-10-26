import { UserDBType } from "../../db/types";
import { TYPE_ATTACK, TYPE_CREATE_ROOM, TYPE_FINISH, TYPE_START_GAME, TYPE_TURN, TYPE_UPD_ROOM } from "../constants";
import { handleServerError } from "../controller";
import { createRoom } from "../controllers/gameController";
import { WSRequest, WSResponse } from "../interfaces";

export const handleRequestGame = (request: WSRequest, currentUser: UserDBType | undefined): WSResponse | undefined => {
  let type: string = '';
  let gameResponse: any = {};
  try {
    switch (request.type) {
      case TYPE_CREATE_ROOM:
        type = TYPE_UPD_ROOM;
        gameResponse = [createRoom(currentUser)];
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
    const response: WSResponse = {
      type,
      data: JSON.stringify(gameResponse),
      id: 0,
    }

    return response;
  } catch (error) {
    handleServerError(request, error);
  }
};
