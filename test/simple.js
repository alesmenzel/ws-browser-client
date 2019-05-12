import WS from '../src/websocket';

const ws = new WS('wss://echo.websocket.org/', {
  reconnect: true,
  reconnectTimeout: 5000,
  reconnectAttempts: Infinity,
  emitTimeout: 30000,
});

ws.on('connect', () => {
  console.log('Connected to wss server');
});

ws.on('disconnect', reason => {
  console.log('Disconnected from wss server', { reason });
});

ws.on('error', err => {
  console.log('Error', { err });
});
