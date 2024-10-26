
export interface WSRequest {
  type: string;
  data: string;
  id: number;
};

export interface WSResponse {
  type: string;
  data: string;
  id: number | string;
};

export interface UserResponseData {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}

export interface UpatedWinnersResponseData {
  name: string;
  wins: number;
}

export interface CreateGameResponseData {
  idGame: number | string;
  idPlayer: number | string;
}

export interface RoomUser {
  name: string;
  index: number | string;
}

export interface UpdateRoomResponseData {
  roomId: number | string;
  roomUsers: RoomUser[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export interface StartGameResponseData {
  ships: Ship[];
  currentPlayerIndex: number | string;
}

export interface AttackResponseData {
  position: Position;
  currentPlayer: number | string;
  status: "miss" | "killed" | "shot";
}

export interface TurnResponseData {
  currentPlayer: number | string;
}

export interface FinishGameResponseData {
  winPlayer: number | string;
}
