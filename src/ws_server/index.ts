import { WebSocket, WebSocketServer } from 'ws';
import { handleRequest } from './controller';
import { WSRequest, WSResponse } from './interfaces';
import { db } from '../db/db';
import { MyWebSocket } from './MyWebSocket';

export const webSocketServer = new WebSocketServer({ port: 3000 });

webSocketServer.on('connection', (ws: MyWebSocket) => {
  ws.on('message', (message) => {
    const request: WSRequest = JSON.parse(message.toString());
    handleRequest(ws, request);

    if (request.type === 'reg') {
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

export const sendResponse = (ws:WebSocket, response: WSResponse | undefined): void => {
  if (response) {
    ws.send(JSON.stringify(response));
  }
};

console.log('WebSocketServer started on port 3000');
