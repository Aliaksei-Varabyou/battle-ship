import { WebSocket, WebSocketServer } from 'ws';
import { handleRequest } from './controller';

export const webSocketServer = new WebSocketServer({ port: 3000 });

webSocketServer.on('connection', (ws: WebSocket) => {
  ws.on('message', (message) => {
    handleRequest(ws, message);
  });

  ws.on('close', () => {
    console.log('Connection closed');
  });

  ws.on('error', console.error);
});

console.log('WebSocketServer started on port 3000');
