class UILoop {

  constructor(fps) {
    this.fps = fps || 60;
    this.__callbacks = [];
    this.__running = false;
    this.__animationFrameId = null;
  }

  register(func, args = [], ctx = null) {
    var ticket = { func, args, ctx };
    this.__callbacks.push(ticket);
  }

  start() {
    if (this.__running) { return; }

    this.__running = true;
    this.__animationFrameId = window.requestAnimationFrame(() => this.draw());
  }

  stop() {
    if (!this.__running) { return; }

    this.__running = false;
    window.cancelAnimationFrame(this.__animationFrameId);
  }

  exec() {
    if (!this.__callbacks.length) { return; }

    // callback must be called in the same order they were registered
    for (var i = 0; i < this.__callbacks.length; i++) {
      var ticket = this.__callbacks[i];
      ticket.func.apply(ticket.ctx, ticket.args);
      this.__callbacks.splice(i, 1);
      // decrement to keep in sync with callbacks length
      i = i - 1;
    }
  }

  draw(e) {
    if (!this.__running) { return; }
    
    this.exec();
    this.__animationFrameId = window.requestAnimationFrame(() => this.draw());
  }
}

module.exports = UILoop;