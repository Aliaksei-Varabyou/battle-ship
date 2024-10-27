import { db } from "../../db/db";
import { CreateGameResponseData, RoomUser } from "../interfaces";

export const createGame = (users: RoomUser[]): Map<string, CreateGameResponseData> => {
  let createGames = new Map<string, CreateGameResponseData>;
  users.map(user => {
    createGames.set(user.index.toString(), db.createGame(user));
  });
  return createGames;
};
