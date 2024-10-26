import { WebSocket } from "ws";
import { ALL_TYPES, GAME_TYPES, USER_TYPES } from "./constants";
import { WSRequest, WSResponse } from "./interfaces";
import { handleRequestAll } from "./routes/allRoutes";
import { handleRequestGame } from "./routes/gameRoutes";
import { handleRequestUser } from "./routes/userRoutes";

const logRequest = (request: WSRequest) => {
  console.log(request.type, '->', request );
};

const logResponse = (type: string, response: WSResponse) => {
  console.log(type, '<-', JSON.stringify(response) );
};

export const handleRequest = (ws: WebSocket, message: { toString: () => string; }): WSResponse | undefined => {
  const request: WSRequest = JSON.parse(message.toString());
  logRequest(request);

  const type: string = request?.type;
  let response: WSResponse | undefined;

  if (USER_TYPES.includes(type)) {
    response = handleRequestUser(request);
    ws.send(JSON.stringify(response));
  } else if (GAME_TYPES.includes(type)) {
    response = handleRequestGame(request);
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
