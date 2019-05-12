# WebSocket for Browser

```js
const socket = Socket(url, {
  reconnect: true,
  reconnectTimeout: 5000 || (attempt) => {},
  reconnectAttempts: Infinity,
  emitTimeout: 30000,
})

options.timeout = 30000; // 30s
socket.emit('event-type', requestData, [options], (err, responseData) => {
// err can be a timeout, or server error (e.g. bad request)
});

socket.join('chat-<id>');

socket.emit('event-type', requestData, [options]);

socket.on('event-type', (responseData) => {
// do stuff
})

socket.on('error', (err) => {}) // + reconnect errors
socket.on('connect', (meta) => {}) // + reconnect events
socket.on('disconnect', (reason) => {})

-> join namespace
<- sync
<- update
<- update
<- update
- disconnect
-> join namespace
<- sync
<- update
<- update
<- update
```
