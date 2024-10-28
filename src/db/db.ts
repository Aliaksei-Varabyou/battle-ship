import { createHash, randomUUID } from 'node:crypto';
import { UserDBType, RoomDBType, WinnerDBType, GameDBType, PlayerDbType } from "./types";
import { RoomUser, Ship } from '../ws_server/interfaces';
import { MyWebSocket } from '../ws_server/MyWebSocket';

class battleshipDB {
  private users = new Map<string, UserDBType>;
  private rooms = new Map<string, RoomDBType>;
  private winners = new Map<string, WinnerDBType>;
  private games = new Map<string, GameDBType>;
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

  public createGame = (users: RoomUser[]): GameDBType => {
    const idGame = randomUUID();
    const players: Map<string, PlayerDbType> = new Map<string, PlayerDbType>;
    users.forEach(user => {
      players.set(user.index.toString(), {
        idPlayer: user.index,
        ships: [],
        shipsAdded: false,
      });
    });
    const newGame: GameDBType = {
      idGame,
      players,
      currentPlayer: users[0].index,
    }
    this.games.set(idGame, newGame);
    return newGame;
  };

  public addShips2Game = (idGame: string, indexPlayer: string, ships: Ship[]): GameDBType | undefined => {
    let game: GameDBType | undefined = this.games.get(idGame);
    if (ships && idGame && indexPlayer) {
      let player: PlayerDbType = {
        idPlayer: indexPlayer,
        ships,
        shipsAdded: true,
      }
      game?.players.set(indexPlayer, player);
      if (game?.idGame) {
        this.games.set(idGame, game);
      }
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
    const gameId = firstPlayer?.gameId;
    let shipsAddedCount = 0;
    let users: UserDBType[] = [];
    if (gameId) {
      const game = this.games.get(gameId?.toString());
      if (game) {
        const players = game.players;
        Array.from(players.values()).forEach(player => {
          if (player.shipsAdded) shipsAddedCount++;
          const user = this.users.get(player.idPlayer.toString());
          if (user) users.push(user);
        })
      }
    }
    if (shipsAddedCount === 2) {
      return users;
    }
    return false;
  };

  public getUserShips = (userId: string): Ship[] | undefined => {
    const user = this.users.get(userId);
    if (user) {
      const game = this.games.get(user.gameId);
      const player = game?.players.get(userId)
      if (player) {
        return player?.ships;
      }
    }
  };

  public changeCurrentPlayer = (userId: string): GameDBType | undefined => {
    const gameId = this.users.get(userId)?.gameId;
    if (gameId) {
      const game = this.games.get(gameId);
      if (game?.idGame) {
        const players = Array.from(game?.players.keys());
        const nextPlayer = players[0] === userId ? players[1] : players[0];
        const updatedGame = {
          ...game,
          currentPlayer: nextPlayer,
        }
        this.games.set(gameId, updatedGame);
      }
      return game;
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
