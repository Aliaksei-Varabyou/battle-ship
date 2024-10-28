import { db } from "../../db/db";
import { GameDBType, UserDBType } from "../../db/types";
import {
  AddShipsRequestData,
  CreateGameResponseData,
  RoomUser,
  Ship,
  TurnResponseData,
} from "../interfaces";
import { MyWebSocket } from "../MyWebSocket";

export const createGame = (users: RoomUser[]): Map<string, CreateGameResponseData> => {
  let createGames = new Map<string, CreateGameResponseData>;
  const newGame= db.createGame(users);
  users.map(user => {
    const createGameResponse: CreateGameResponseData = {
      idGame: newGame.idGame,
      idPlayer: user.index,
    };
    createGames.set(user.index.toString(), createGameResponse);
  });
  return createGames;
};

export const addShips = (data: AddShipsRequestData): UserDBType[] | boolean => {
  const {gameId, indexPlayer, ships} = data;
  if (!!gameId) {
    db.addShips2Game(gameId.toString(), indexPlayer.toString(), ships)
  }
  return db.getUsersIfPlayersReady(indexPlayer.toString());
};

export const getUserShips = (userId: string): Ship[] | undefined => {
  return db.getUserShips(userId);
};

export const gameTurn = (userId: string): Map<MyWebSocket, any> => {
  let result: Map<MyWebSocket, any> = new Map<MyWebSocket, any>;
  const game = db.changeCurrentPlayer(userId.toString());
  const wsWithUsers = db.getAllWebsocketsWithUsers();
  if (game) {
    const currentPlayer = game.currentPlayer;
    const players = Array.from(game.players.keys());
    wsWithUsers.forEach((user, ws) => {
      if (players.includes(user.id)) {
        result.set(ws, {currentPlayer});
      }
    });
  }
  return result;
};
