import { UserDBType } from "../../db/types";
import { TYPE_ADD_USER_2_ROOM, TYPE_CREATE_GAME, TYPE_CREATE_ROOM, TYPE_UPD_ROOM } from "../constants";
import { handleServerError } from "../controller";
import { createGame } from "../controllers/gameController";
import { addUser2Room, createRoom } from "../controllers/roomController";
import { CreateGameResponseData, UpdateRoomResponseData, WSRequest, WSResponse } from "../interfaces";

export type ReturnRoomType = {
  response: WSResponse;
  createGame: Map<string, CreateGameResponseData>;
}

export const handleRequestRoom = (request: WSRequest, currentUser: UserDBType | undefined): ReturnRoomType | undefined => {
  let type: string = '';
  let roomResponse: any = {};
  let createGameResponse = new Map<string, CreateGameResponseData>;
  try {
    switch (request.type) {
      case TYPE_CREATE_ROOM:
        type = TYPE_UPD_ROOM;
        roomResponse = [createRoom(currentUser)];
        break;
      case TYPE_ADD_USER_2_ROOM:
        type = TYPE_CREATE_GAME;
        const result: UpdateRoomResponseData | undefined = addUser2Room(currentUser, JSON.parse(request.data));
        if (result && result.roomUsers && result.roomUsers.length > 1) {
          createGameResponse = createGame(result?.roomUsers);
        }
        break;
    }
    const response: WSResponse = {
      type,
      data: JSON.stringify(roomResponse),
      id: 0,
    }

    return {
      response,
      createGame: createGameResponse,
    }
  } catch (error) {
    handleServerError(request, error);
  }
};
