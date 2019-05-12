class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  /**
   * Add an event listener
   *
   * @param {String} event Event ID
   * @param {Function} listener Listener function
   */
  addEventListener(event, listener) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(listener);
    return this;
  }

  /**
   * Alias for addEventListener
   */
  on(...args) {
    return this.addEventListener(...args);
  }

  /**
   * Remove an event listener
   *
   * @param {String} event Event ID
   * @param {Function} listener Listener function
   */
  removeEventListener(event, listener) {
    if (!this.listeners[event]) {
      return this;
    }
    this.listeners = this.listeners[event].filter(fnc => fnc !== listener);
    return this;
  }

  /**
   * Alias for removeEventListener
   */
  off(...args) {
    return this.removeEventListener(...args);
  }

  /**
   * Dispatch an event
   *
   * @param {String} event Event ID
   * @param  {...any} args Data to pass to every listener of the event type
   */
  dispatchEvent(event, ...args) {
    if (!this.listeners[event]) {
      return this;
    }
    this.listeners[event].forEach(fnc => fnc(...args));
    return this;
  }

  /**
   * Alias for dispatchEvent
   */
  emit(...args) {
    return this.dispatchEvent(...args);
  }
}

export default EventEmitter;
