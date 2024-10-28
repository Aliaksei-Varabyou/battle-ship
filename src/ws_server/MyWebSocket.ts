
import WebSocket from 'ws';
import { UserDBType } from '../db/types';

export class MyWebSocket extends WebSocket {
  public user?: UserDBType;

  constructor(address: string | URL, protocols?: string | string[]) {
    super(address, protocols);
  }
}