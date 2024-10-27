import { ALL_TYPES, GAME_TYPES, ROOM_TYPES, TYPE_REG, TYPE_UPD_ROOM, TYPE_UPD_WINNERS, USER_TYPES } from "./constants";
import { WSRequest, WSResponse } from "./interfaces";
import { handleRequestGame } from "./routes/gameRoutes";
import { handleRequestRoom } from "./routes/roomRoutes";
import { handleRequestUser } from "./routes/userRoutes";
import { sendResponse } from ".";
import { UserDBType } from "../db/types";
import { MyWebSocket } from "./MyWebSocket";
import { db } from "../db/db";

export const handleRequest = (ws: MyWebSocket, request: WSRequest): void => {

  const type: string = request?.type;
  let response: WSResponse | undefined;
  const currentUser: UserDBType | undefined = ws.user ?? undefined;

  if (USER_TYPES.includes(type)) {
    response = handleRequestUser(ws, request);
    sendResponse(ws, response);
    if (request.type === TYPE_REG) {
      const data = JSON.parse(request.data);
      const user = db.getUserByName(data.name)
      ws.user = user;
    }
    sendUpdateRoom();
    sendUpdateWinners();
  } else if (ROOM_TYPES.includes(type)) {
    response = handleRequestRoom(request, currentUser);
    sendResponse(ws, response);
  } else if (GAME_TYPES.includes(type)) {
    response = handleRequestGame(request, currentUser);
    sendResponse(ws, response);
  } else if (ALL_TYPES.includes(type)) {
    // response = handleRequestAll(request);
  } else {
    // ToDo: server error here
  }

};

export const sendUpdateRoom = (): void => {
  const data = db.getAllRooms();
  const response: WSResponse = {
    type: TYPE_UPD_ROOM,
    data: JSON.stringify(data),
    id: 0,
  }
  const allWs = db.getAllWebsockets();
  allWs.forEach((ws) => sendResponse(ws, response));
};

export const sendUpdateWinners = (): void => {
  const data = db.getAllWinners();
  const response: WSResponse = {
    type: TYPE_UPD_WINNERS,
    data: JSON.stringify(data),
    id: 0,
  }
  const allWs = db.getAllWebsockets();
  allWs.forEach((ws) => sendResponse(ws, response));
};

export const handleServerError = (request: WSRequest, error: unknown): void => {
  console.error('Server Error:', error);
  // ToDo: ??? do we really need it?
};
