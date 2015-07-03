/**
 * @class TimeContext
 *
 * A TimeContext instance represents a time segment and its horizontal scale to the pixel domain.
 * A timeContext is attached to a `Timeline` instance or its `Layer`.
 * When attached to a layer, a timeContext has a parent timeContext, the one attached to the timeline it belongs to.
 *
 * A timeContext has four importants attributes:
 * - timeContext.start which defines the start time of the context in seconds.
 *   - From a layer perspective, this could be the time at which temporal data must be represented in the timeline (for instance the begining of a soundfile in a DAW).
 *   - From a timeline perspective, this will always be 0.
 * - timeContext.offset which defines the offset time of the context in seconds.
 *   - From a timeline perspective, it is a way to have a window view upon a large timeline for instance.
 *   - From a layer perspective, this could be the offset time of the data in the context of a Layer (@TODO give a use case example here "crop ?", and/or explain that it's not a common use case).
 * - timeContext.duration which defines the duration
 *   - From a layer perspective, this is the duration of the temporal data (eg. the duration of a soundfile)
 *   - From a timeline perspective, this is the overall duration of the timeline
 * - timeContext.stretchRatio which defines the stretch applied
 *   - From a timeline perspective, this is zoom factor we apply to the timeline
 *   - From a layer perspective, this is a way to stretch the datas.
 */
class AbstractTimeContext {
  constructor(params) {
    this.params = params; // a holder to keep reference to attributes (must be implemented)
  }
}

module.exports = AbstractTimeContext;
