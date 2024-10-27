import { UserDBType } from "../../db/types";
import { TYPE_ADD_USER_2_ROOM, TYPE_CREATE_ROOM, TYPE_UPD_ROOM } from "../constants";
import { handleServerError } from "../controller";
import { createRoom } from "../controllers/roomController";
import { WSRequest, WSResponse } from "../interfaces";

export const handleRequestRoom = (request: WSRequest, currentUser: UserDBType | undefined): WSResponse | undefined => {
  let type: string = '';
  let gameResponse: any = {};
  try {
    switch (request.type) {
      case TYPE_CREATE_ROOM:
        type = TYPE_UPD_ROOM;
        gameResponse = [createRoom(currentUser)];
        break;
      case TYPE_ADD_USER_2_ROOM:
        
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
