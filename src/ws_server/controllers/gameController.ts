// import { db } from "../../db/db";
// import { UserDBType } from "../../db/types";
// import { RoomUser, UpdateRoomResponseData } from "../interfaces";

// export const createRoom = (user: UserDBType | undefined): UpdateRoomResponseData => {
//   let newRoom: UpdateRoomResponseData = {
//     roomId: '',
//     roomUsers: [],
//   };
//   if (user) {
//     const roomUser: RoomUser = {
//       name: user.name,
//       index: user.id,
//     }
//     newRoom = db.createRoom(roomUser);
//   }
//   return newRoom;
// };
