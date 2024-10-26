import { WebSocket, WebSocketServer } from 'ws';
import { handleRequest, logResponse } from './controller';
import { WSRequest, WSResponse } from './interfaces';
import { db } from '../db/db';
import { MyWebSocket } from './MyWebSocket';
import { TYPE_REG, TYPE_UPD_ROOM, TYPE_UPD_WINNERS } from './constants';

export const webSocketServer = new WebSocketServer({ port: 3000 });

webSocketServer.on('connection', (ws: MyWebSocket) => {
  ws.on('message', (message) => {
    const request: WSRequest = JSON.parse(message.toString());
    handleRequest(ws, request);

    if (request.type === TYPE_REG) {
      const data = JSON.parse(request.data);
      const user = db.getUserByName(data.name)
      ws.user = user;
    }
  });

  ws.on('close', () => {
    console.log(`Connection closed for user ${ws.user ? ws.user.name : 'unknown'}`);
    delete ws.user;
  });

  ws.on('error', console.error);
});

export const sendResponse = async (ws:WebSocket, response: WSResponse | undefined): Promise<void> => {
  if (response) {
    ws.send(JSON.stringify(response));
    logResponse(response.type, response);
  }
};

export const sendUpdateRoom = (ws: MyWebSocket): void => {
  const data = db.getAllRooms();
  const response: WSResponse = {
    type: TYPE_UPD_ROOM,
    data: JSON.stringify(data),
    id: 0,
  }
  sendResponse(ws, response);
};

export const sendUpdateWinners = (ws: MyWebSocket): void => {
  const data = db.getAllWinners();
  const response: WSResponse = {
    type: TYPE_UPD_WINNERS,
    data: JSON.stringify(data),
    id: 0,
  }
  sendResponse(ws, response);
};

console.log('WebSocketServer started on port 3000');
