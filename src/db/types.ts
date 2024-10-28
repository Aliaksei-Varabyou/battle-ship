import { Position, RoomUser, Ship } from "../ws_server/interfaces";

export type UserDBType = {
  id: string;
  name: string;
  password: string;
  roomId: string;
  gameId: string;
  wins: number;
};

export type RoomDBType = {
  roomId: string;
  roomUsers: RoomUser[];
}

export type WinnerDBType = {
  name: string;
  wins: number;
}

export type PlayerDbType = {
  idPlayer: number | string;
  ships: Ship[];
  shipsAdded: boolean;
}

export type GameDBType = {
  idGame: number | string;
  players: Map<string, PlayerDbType>;
  currentPlayer: number | string;
}
