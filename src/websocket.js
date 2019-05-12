import EventEmitter from './event-emitter';
import WSError from './ws-error';

// eslint-disable-next-line no-undef
const { WebSocket } = window;

const NormalClosure = 1000;

const aliases = {
  connect: 'open',
  disconnect: 'close',
};

class WS extends EventEmitter {
  /**
   * WS
   *
   * @example Usage examples:
   * No options given, must call connect manually
   * ```js
   * const ws = new WS();
   * ws.connect('ws://localhost:8080');
   * ```
   *
   * URL given and no options, the default behavior is to connect automatically
   * ```js
   * const ws = new WS('ws://localhost:8080');
   * ```
   *
   * Only options given, must call connect manually
   * ```js
   * const ws = new WS({ connect: true, ... });
   * ws.connect('ws://localhost:8080');
   * ```
   *
   * URL and options passed, will connect automatically if `connect` is `true`
   * ```js
   * new WS('ws://localhost:8080', { connect: true, ... })
   * ```
   *
   * @param {String} [url] URL to connect to
   * @param {Object} [options] WS and WebSocket options
   */
  constructor(url, options = {}) {
    super();

    // Optional url parameter
    /* eslint-disable no-param-reassign */
    if (typeof url === 'object') {
      options = url;
      url = null;
    }
    /* eslint-enable no-param-reassign */

    const {
      connect = true,
      reconnect = true,
      reconnectTimeout = 5000,
      reconnectAttempts = Infinity,
      emitTimeout = 30000,
      ...rest
    } = options;

    this.url = url;
    this.connect = connect;
    this.reconnect = reconnect;
    this.reconnectTimeout = reconnectTimeout;
    this.reconnectAttempts = reconnectAttempts;
    this.emitTimeout = emitTimeout;
    this.options = rest;
    this.attempt = 0;
    this.closedByClient = false;
    this.closedByServer = false;

    if (this.connect && !this.url) {
      throw new WSError(
        'You specified `connect` option as true, but did not pass any URL to connect to, did you forget to pass url in constructor?'
      );
    }

    if (this.connect && this.url) {
      this.connect();
    }
  }

  /**
   * Register event listener
   *
   * @param {String} event Event ID
   * @param  {Function} listener Listener
   */
  on(event, listener) {
    const eventName = aliases[event] || event;
    return this.addEventListener(eventName, listener);
  }

  /**
   * Send data to the server
   *
   * @param {String} event Event ID
   * @param  {...any} args Data to send
   */
  emit(event, ...args) {
    if (!this.socket) {
      throw new WSError('Must be connected to send a message, did you forgot to call `connect()`?');
    }
    this.send({ event, data: args });
  }

  /**
   * Join a room
   *
   * @param {String} room Room ID
   * @param  {...any} args Data to send
   */
  join(room, ...args) {
    this.emit('join', { room, ...args });
  }

  /**
   * Handle error
   *
   * @param {Error} err Error
   */
  onError(err) {
    this.emit('error', err);
  }

  /**
   * Handle connection
   */
  onOpen() {
    this.emit('open', this.url);
    this.emit('connect', this.url);
    this.emit('connected', this.url);
  }

  /**
   * Handle disconnect
   */
  onClose(e) {
    const { code, reason, wasClean } = e;
    this.emit('close', code, reason, wasClean);
    this.emit('disconnect', code, reason, wasClean);
    this.emit('disconnected', code, reason, wasClean);

    // Do not reconnect if closed normally
    if (code === NormalClosure) {
      if (!this.closedByClient) {
        this.closedByServer = true;
      }
      return;
    }

    this.reconnect();
  }

  estabilishConnection() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('error', this.onError);
    this.socket.addEventListener('open', this.onOpen);
    this.socket.addEventListener('close', this.onClose);
    return this;
  }

  /**
   * Connect to the server
   *
   * @param {String} url URL
   */
  connect(url) {
    this.attempt = 0;
    this.closedByClient = false;
    this.closedByServer = false;
    if (url) {
      this.url = url;
    }
    if (!this.url) {
      throw new WSError(
        'Must specify an URL to connect to in `constructor(url, { ... })` or in `connect(url)`'
      );
    }
    this.emit('connecting');
    return this.estabilishConnection();
  }

  /**
   * Alias for connect
   */
  open() {
    return this.connect();
  }

  /**
   * Disconnect from the server
   */
  disconnect() {
    this.closedByClient = true;
    this.socket.close(NormalClosure, 'Closed by client');
    return this;
  }

  /**
   * Alias for disconnect
   */
  close() {
    return this.disconnect();
  }

  /**
   * Reconnect to a server
   *
   * @param {String} url URL
   */
  reconnect(url) {
    if (!this.socket) {
      throw new WSError(
        'Trying to reconnect without being connected first, did you forgot to call `connect(url)` or pass an url in constructor?'
      );
    }
    this.socket.close();
    if (url) {
      this.url = url;
    }
    this.attempt += 1;
    this.emit('reconnecting', this.attempt);
    return this.estabilishConnection();
  }
}

export default WS;
