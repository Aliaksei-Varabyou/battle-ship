import { db } from "../../db/db";
import { RoomDBType, UserDBType } from "../../db/types";
import { RoomUser, UpdateRoomResponseData } from "../interfaces";

export const createRoom = (user: UserDBType | undefined): UpdateRoomResponseData => {
  let newRoom: UpdateRoomResponseData = {
    roomId: '',
    roomUsers: [],
  };
  if (user) {
    const roomUser: RoomUser = {
      name: user.name,
      index: user.id,
    }
    newRoom = db.createRoom(roomUser);
  }
  return newRoom;
};

export const addUser2Room = (user: UserDBType | undefined, data: any): UpdateRoomResponseData | undefined => {
  if (user) {
    const roomUser: RoomUser = {
      name: user.name,
      index: user.id,
    }
    return db.addUser2Room(data?.indexRoom, roomUser);
  }
};
