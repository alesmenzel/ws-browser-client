# WebSocket for Browser

Light wrapper around native WebSocket object that provides reconnect functionality, concept of rooms and ease of use aliases.

## Installation

To install the stable version:

```bash
npm install --save @alesmenzel/ws-browser-client
```

## Usage

WIP

```js
import WS from '@alesmenzel/ws-browser-client';

const ws = new WS(url, { /* ...options */ });

ws.on('error', (err) => {
  console.log('Socket Error', err);
});

ws.on('connect', (url) => {
  console.log('Connected to ', url);
});

ws.on('msg', (msg) => {
  console.log('Message: ', msg);
});

ws.join('chat');

ws.emit('msg', 'Hello World!');
// Or with ack
ws.emit('msg', 'Hello World!', { timeout: 5000 }, (err, data) => {
  if (err) {
    console.log('Could not deliver message ', msg);
    return;
  }
  
  console.log('Message delivered, server response ', data);
});
```
