import {
  GAME_TYPES,
  ROOM_TYPES,
  SHIP_TYPES,
  TYPE_ADD_USER_2_ROOM,
  TYPE_CREATE_GAME,
  TYPE_REG,
  TYPE_START_GAME,
  TYPE_TURN,
  TYPE_UPD_ROOM,
  TYPE_UPD_WINNERS,
  USER_TYPES,
} from "./constants";
import { CreateGameResponseData, WSRequest, WSResponse } from "./interfaces";
import { handleRequestGame } from "./routes/gameRoutes";
import { handleRequestRoom } from "./routes/roomRoutes";
import { handleRequestUser } from "./routes/userRoutes";
import { sendResponse } from ".";
import { UserDBType } from "../db/types";
import { MyWebSocket } from "./MyWebSocket";
import { db } from "../db/db";
import { handleRequestShip } from "./routes/shipRouter";
import { addGame2User, getWsMapResponses } from "./controllers/userController";
import { gameTurn } from "./controllers/gameController";

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
    const result = handleRequestRoom(request, currentUser);
    if (request.type === TYPE_ADD_USER_2_ROOM && result?.createGame) {
      sendCreateGame(result?.createGame);
    } else {
      sendResponse(ws, result?.response);
    }
    sendUpdateRoom();

  } else if (SHIP_TYPES.includes(type)) {
    const responses = handleRequestShip(request);
    if (responses) {
      const mapResponses = getWsMapResponses(responses, 'currentPlayerIndex');
      sendRoomResponse(TYPE_START_GAME, mapResponses);
      if (currentUser?.id) {
        sendRoomResponse(TYPE_TURN, gameTurn(currentUser?.id));
      }
    }

  } else if (GAME_TYPES.includes(type)) {
    response = handleRequestGame(request, currentUser);
    sendResponse(ws, response);

  } else {
    // ToDo: server error here
  }

};

const sendUpdateRoom = (): void => {
  const data = db.getAllRooms();
  const response: WSResponse = {
    type: TYPE_UPD_ROOM,
    data: JSON.stringify(data),
    id: 0,
  }
  const allWs = db.getAllWebsockets();
  allWs.forEach((ws) => sendResponse(ws, response));
};

const sendUpdateWinners = (): void => {
  const data = db.getAllWinners();
  const response: WSResponse = {
    type: TYPE_UPD_WINNERS,
    data: JSON.stringify(data),
    id: 0,
  }
  const allWs = db.getAllWebsockets();
  allWs.forEach((ws) => sendResponse(ws, response));
};

const sendCreateGame = (createGames: Map<string, CreateGameResponseData>): void => {
  let response: WSResponse = {
    type: TYPE_CREATE_GAME,
    data: '',
    id: 0,
  }
  const userIds = Array.from(createGames.keys());
  const allWsUsers: Map<MyWebSocket, UserDBType> = db.getAllWebsocketsWithUsers();
  for (const [ws, user] of allWsUsers.entries()) {
    if (userIds.includes(user.id)) {
      const game: CreateGameResponseData | undefined = createGames.get(user.id);
      response.data = JSON.stringify(game);
      sendResponse(ws, response)
      if (game?.idGame) addGame2User(user, game?.idGame);
    }
  }
};

const sendRoomResponse = (type: string, roomResponses: Map<MyWebSocket, any>): void => {
  let response: WSResponse = {
    type,
    data: '',
    id: 0,
  };
  const wss = Array.from(roomResponses.keys());
  wss.map((ws) => {
    response.data = JSON.stringify(roomResponses.get(ws));
    sendResponse(ws, response);
  });
};

export const handleServerError = (request: WSRequest, error: unknown): void => {
  console.error('Server Error:', error);
};
