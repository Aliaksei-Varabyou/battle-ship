import { createHash, randomUUID } from 'node:crypto';
import { UserDBType, RoomDBType, WinnerDBType } from "./types";
import { RoomUser } from '../ws_server/interfaces';
import { MyWebSocket } from '../ws_server/MyWebSocket';

class battleshipDB {
  private users = new Map<string, UserDBType>;
  private rooms = new Map<string, RoomDBType>;
  private winners = new Map<string, WinnerDBType>;
  private users_ws = new Map<MyWebSocket, UserDBType>;

  public createUser = (ws: MyWebSocket, regUser: any): UserDBType => {
    const password = createHash('sha256').update(regUser.password).digest('hex');
    const id = randomUUID();
    const newUser: UserDBType = {
      id,
      name: regUser.name,
      password,
      roomId: '',
      wins: 0,
    };
    this.users.set(id, newUser);
    const newWinner: WinnerDBType = {
      name: regUser.name,
      wins: 0,
    };
    this.winners.set(regUser.name, newWinner);
    this.users_ws.set(ws, newUser);
    return newUser;
  };

  public getUserByName = (userName: string): UserDBType | undefined => {
    for (let user of this.users.values()) {
      if (user.name === userName) return user;
    }
    return undefined;
  };

  public createRoom = (user: RoomUser): RoomDBType => {
    const roomId = randomUUID();
    const newRoom: RoomDBType = {
      roomId,
      roomUsers: [user]
    }
    this.rooms.set(roomId, newRoom);
    return newRoom;
  };

  public getAllRooms = (): RoomDBType[] => {
    return [...this.rooms.values()];
  };

  public getAllWinners = (): WinnerDBType[] => {
    return [...this.winners.values()];
  };

  public getAllWebsockets = (): WebSocket[] => {
    return [...this.users_ws.keys()];
  };

};

export const db = new battleshipDB();
