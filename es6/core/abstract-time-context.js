/**
 *  @class AbstractTimeContext
 *
 *  Looks mostly like a no op for now... here for sentimental reasons
 */
class AbstractTimeContext {
  constructor(params) {
    this.params = params; // a holder to keep reference to attributes (must be implemented)
  }
}

module.exports = AbstractTimeContext;
