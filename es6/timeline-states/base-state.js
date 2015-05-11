
class BaseState {
  constructor(timeline) {
    this.timeline = timeline;
  }

  enter() {}
  exit() {}

  handleEvent(e) {}
}

module.exports = BaseState;