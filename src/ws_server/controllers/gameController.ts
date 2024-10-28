import { db } from "../../db/db";
import { UserDBType } from "../../db/types";
import {
  AddShipsRequestData,
  CreateGameResponseData,
  RoomUser,
  Ship,
} from "../interfaces";

export const createGame = (users: RoomUser[]): Map<string, CreateGameResponseData> => {
  let createGames = new Map<string, CreateGameResponseData>;
  users.map(user => {
    createGames.set(user.index.toString(), db.createGame(user));
  });
  return createGames;
};

export const addShips = (data: AddShipsRequestData): UserDBType[] | boolean => {
  const {gameId, indexPlayer, ships} = data;
  if (!!gameId) {
    db.addShips2Game(gameId.toString(), ships)
  }
  return db.getUsersIfPlayersReady(indexPlayer.toString());
};

export const getGameShips = (gameId: string): Ship[] | undefined => {
  return db.getGameShips(gameId);
};

export const getUserShips = (userId: string): Ship[] | undefined => {
  return db.getUserShips(userId);
};
