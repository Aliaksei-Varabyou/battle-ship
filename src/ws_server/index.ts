import { WebSocket, WebSocketServer } from 'ws';
import { handleRequest } from './controller';
import { WSRequest, WSResponse } from './interfaces';
import { MyWebSocket } from './MyWebSocket';

const logRequest = (request: WSRequest) => {
  console.log('\x1b[33m%s\x1b[0m: %s', request.type, '->', request );
};

const logResponse = (type: string, response: WSResponse) => {
  console.log('\x1b[35m%s\x1b[0m: %s', type, '<-', JSON.stringify(response) );
};

const webSocketServer = new WebSocketServer({ port: 3000 });

webSocketServer.on('connection', (ws: MyWebSocket) => {
  ws.on('message', (message) => {
    const request: WSRequest = JSON.parse(message.toString());
    logRequest(request);
    handleRequest(ws, request);    
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

console.log('WebSocketServer started on port 3000');
