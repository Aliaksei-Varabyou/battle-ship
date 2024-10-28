import { createHash, randomUUID } from 'node:crypto';
import { UserDBType, RoomDBType, WinnerDBType, GameDBType } from "./types";
import { RoomUser, Ship } from '../ws_server/interfaces';
import { MyWebSocket } from '../ws_server/MyWebSocket';

class battleshipDB {
  private users = new Map<string, UserDBType>;
  private rooms = new Map<string, RoomDBType>;
  private winners = new Map<string, WinnerDBType>;
  private games = new Map<string, GameDBType>
  private users_ws = new Map<MyWebSocket, UserDBType>;

  public createUser = (ws: MyWebSocket, regUser: any): UserDBType => {
    const password = createHash('sha256').update(regUser.password).digest('hex');
    const id = randomUUID();
    const newUser: UserDBType = {
      id,
      name: regUser.name,
      password,
      roomId: '',
      gameId: '',
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
    let updatedUser = this.users.get(user.index.toString());
    if (updatedUser?.id) {
      this.users.set(user.index.toString(), {
        ...updatedUser,
        roomId
      });
    }
    return newRoom;
  };

  public addUser2Room = (roomId: string, newUser: RoomUser): RoomDBType => {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.error('Room not found');
      return this.createRoom(newUser);
    }

    const userExists = room.roomUsers.some(user => user.index === newUser.index);
    if (!userExists) {
      room.roomUsers.push(newUser);
      let updatedUser = this.users.get(newUser.index.toString());
      if (updatedUser?.id) {
        this.users.set(newUser.index.toString(), {
          ...updatedUser,
          roomId
        });
      }
    }
    return room;
  };

  public createGame = (user: RoomUser): GameDBType => {
    const idGame = randomUUID();
    const newGame: GameDBType = {
      idGame,
      idPlayer: user.index,
      ships: [],
      shipsAdded: false,
    }
    this.games.set(idGame, newGame);
    return newGame;
  };

  public addShips2Game = (idGame: string, ships: Ship[]): GameDBType | undefined => {
    let game: GameDBType | undefined = this.games.get(idGame);
    console.log(9999, idGame, game?.idPlayer);
    if (ships && idGame && game?.idPlayer) {
      game = {
        ...game,
        ships,
        shipsAdded: true,
      }
      console.log("????");
      this.games.set(idGame, game);
    }
    return game;
  };

  public addGame2User = (userId: string, gameId: string): void => {
    const user = this.users.get(userId);
    if (user?.id) {
      const updatedUser: UserDBType = {
        ...user,
        gameId
      }
      this.users.set(userId, updatedUser);
    }
  };

  public getUsersIfPlayersReady = (userId: string): boolean | UserDBType[]  => {
    const firstPlayer = this.users.get(userId);
    const roomId = firstPlayer?.roomId;
    let secondPlayer: UserDBType | undefined;
    let shipsAddedCount = 0;
    if (roomId) {
      const room: RoomDBType | undefined = this.rooms.get(roomId);
      if (room) {
        room.roomUsers.forEach((user) => {
          if (user.index !== firstPlayer.id) {
            secondPlayer = this.users.get(user.index.toString());
          }
          const userDb = this.users.get(user.index.toString());
          if (userDb) {
            const playerGame = this.games.get(userDb.gameId);
            if (playerGame?.shipsAdded) shipsAddedCount++;
          }
      });
      }
    }
    if (secondPlayer && firstPlayer && shipsAddedCount === 2) {
      return [
        firstPlayer,
        secondPlayer,
      ];
    }
    return false;
  };

  public getGameShips = (gameId:string): Ship[] | undefined => {
    const game = this.games.get(gameId.toString());
    return game?.ships;
  }

  public getUserShips = (userId: string): Ship[] | undefined => {
    const user = this.users.get(userId.toString());
    if (user) {
      const playerGame = this.games.get(user.gameId);
      return playerGame?.ships;
    }
  };

  public getAllRooms = (): RoomDBType[] => {
    return [...this.rooms.values()];
  };

  public getAllWinners = (): WinnerDBType[] => {
    return [...this.winners.values()];
  };

  public getAllWebsockets = (): MyWebSocket[] => {
    return [...this.users_ws.keys()];
  };

  public getAllWebsocketsWithUsers = (): Map<MyWebSocket, UserDBType> => {
    return this.users_ws;
  };

};

export const db = new battleshipDB();
