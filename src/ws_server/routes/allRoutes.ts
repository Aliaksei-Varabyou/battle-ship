import { TYPE_UPD_ROOM, TYPE_UPD_WINNERS } from "../constants";
import { handleServerError } from "../controller";
import { WSRequest } from "../interfaces";

export const handleRequestAll = (request: WSRequest): void => {
  try {
    if (request.type === TYPE_UPD_ROOM) {

    } else if (request.type === TYPE_UPD_WINNERS) {

    } else {
      
    }
  } catch (error) {
    handleServerError(request, error);
  }
};
