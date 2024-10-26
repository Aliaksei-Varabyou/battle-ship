import { ALL_TYPES, GAME_TYPES, TYPE_CREATE_ROOM, USER_TYPES } from "./constants";
import { WSRequest, WSResponse } from "./interfaces";
import { handleRequestAll } from "./routes/allRoutes";
import { handleRequestGame } from "./routes/gameRoutes";
import { handleRequestUser } from "./routes/userRoutes";
import { sendResponse, sendUpdateRoom, sendUpdateWinners } from ".";
import { UserDBType } from "../db/types";
import { MyWebSocket } from "./MyWebSocket";

export const logRequest = (request: WSRequest) => {
  console.log('\x1b[33m%s\x1b[0m: %s', request.type, '->', request );
};

export const logResponse = (type: string, response: WSResponse) => {
  console.log('\x1b[35m%s\x1b[0m: %s', type, '<-', JSON.stringify(response) );
};

export const handleRequest = async (ws: MyWebSocket, request: WSRequest): Promise<WSResponse | undefined> => {
  logRequest(request);

  const type: string = request?.type;
  let response: WSResponse | undefined;
  const currentUser: UserDBType | undefined = ws.user ?? undefined;

  if (USER_TYPES.includes(type)) {
    response = handleRequestUser(request);
    await sendResponse(ws, response);
    sendUpdateRoom(ws);
    sendUpdateWinners(ws);
  } else if (GAME_TYPES.includes(type)) {
    response = handleRequestGame(request, currentUser);
    sendResponse(ws, response);
    if (type === TYPE_CREATE_ROOM && response) {
      const room = JSON.parse(response.data);
      ws.room = room;
    }
  } else if (ALL_TYPES.includes(type)) {
    response = handleRequestAll(request);
  } else {
    // ToDo: server error here
  }

};

export const handleServerError = (request: WSRequest, error: unknown): void => {
  console.error('Server Error:', error);
  // ToDo: ??? do we really need it?
};
