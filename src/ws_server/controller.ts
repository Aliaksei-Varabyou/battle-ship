import { ALL_TYPES, GAME_TYPES, USER_TYPES } from "./constants";
import { WSRequest, WSResponse } from "./interfaces";
import { handleRequestAll } from "./routes/allRoutes";
import { handleRequestGame } from "./routes/gameRoutes";
import { handleRequestUser } from "./routes/userRoutes";
import { sendResponse } from ".";
import { UserDBType } from "../db/types";
import { MyWebSocket } from "./MyWebSocket";

const logRequest = (request: WSRequest) => {
  console.log('\x1b[33m%s\x1b[0m: %s', request.type, '->', request );
};

const logResponse = (type: string, response: WSResponse) => {
  console.log('\x1b[35m%s\x1b[0m: %s', type, '<-', JSON.stringify(response) );
};

export const handleRequest = (ws: MyWebSocket, request: WSRequest): WSResponse | undefined => {
  logRequest(request);

  const type: string = request?.type;
  let response: WSResponse | undefined;
  const currentUser: UserDBType | undefined = ws.user ?? undefined;
  console.log('????', currentUser);

  if (USER_TYPES.includes(type)) {
    response = handleRequestUser(request);
    sendResponse(ws, response);
  } else if (GAME_TYPES.includes(type)) {
    response = handleRequestGame(request, currentUser);
    console.log('!!!', response);
    sendResponse(ws, response);
  } else if (ALL_TYPES.includes(type)) {
    response = handleRequestAll(request);
  } else {
    // ToDo: server error here
  }

  // ToDo: smth with response here
  if (response) {
    logResponse(type, response);
    return response;
  }
};

export const handleServerError = (request: WSRequest, error: unknown): void => {
  console.error('Server Error:', error);
  // ToDo: ??? do we really need it?
};
