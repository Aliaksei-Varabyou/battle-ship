import { RoomUser } from "../ws_server/interfaces";

export type UserDBType = {
  id: string;
  name: string;
  password: string;
  roomId: string;
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

export type GameDBType = {
  idGame: number | string;
  idPlayer: number | string;
}
