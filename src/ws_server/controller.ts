import { ALL_TYPES, GAME_TYPES, USER_TYPES } from "./constants";
import { WSRequest } from "./interfaces";
import { handleRequestAll } from "./routes/allRoutes";
import { handleRequestGame } from "./routes/gameRoutes";
import { handleRequestUser } from "./routes/userRoutes";

export const handleRequest = (message: { toString: () => string; }): void => {
  const request: WSRequest = JSON.parse(message.toString());

  const type: string = request?.type;
  let response: unknown;

  if (USER_TYPES.includes(type)) {
    response = handleRequestUser(request);
  } else if (GAME_TYPES.includes(type)) {
    response = handleRequestGame(request);
  } else if (ALL_TYPES.includes(type)) {
    response = handleRequestAll(request);
  } else {
    // ToDo: server error here
  }

  // ToDo: smth with response here
  console.log('RESPONSE::', response);
};

export const handleServerError = (request: WSRequest, error: unknown): void => {
  console.error('Server Error:', error);
  // ToDo: ??? do we really need it?
};
