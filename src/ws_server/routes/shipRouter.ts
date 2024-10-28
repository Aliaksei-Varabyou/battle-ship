import { TYPE_ADD_SHIPS } from "../constants";
import { handleServerError } from "../controller";
import { addShips, getUserShips } from "../controllers/gameController";
import { StartGameResponseData, WSRequest, WSResponse } from "../interfaces";

export const handleRequestShip = (request: WSRequest): StartGameResponseData[] | undefined => {
  let shipResponse: StartGameResponseData = {
    ships: [],
    currentPlayerIndex: 0,
  };
  let responses: StartGameResponseData[] | undefined = [];
  try {
    if (request.type === TYPE_ADD_SHIPS) {  
      const readyPlayers = addShips(JSON.parse(request.data));
      if (Array.isArray(readyPlayers)) {
        readyPlayers.forEach(player => {
          const ships = getUserShips(player.id);
          if (ships) {
            shipResponse = {
              ships,
              currentPlayerIndex: player.id
            }
            responses.push(shipResponse);
          }
        });
      };
    }

    if (responses.length === 2) return responses;
  } catch (error) {
    handleServerError(request, error);
  }
};
