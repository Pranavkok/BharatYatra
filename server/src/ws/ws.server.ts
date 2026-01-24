import { WebSocketServer } from 'ws';
import { handleConnection } from './handlers.js';
import { Server } from 'http';

export class GameServer {
    private wss: WebSocketServer;

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.init();
    }

    private init() {
        this.wss.on('connection', (ws) => {
            handleConnection(ws);
        });
        console.log('WebSocket Server Initialized');
    }
}
