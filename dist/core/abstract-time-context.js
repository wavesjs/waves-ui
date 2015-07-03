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
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var AbstractTimeContext = function AbstractTimeContext(params) {
  _classCallCheck(this, AbstractTimeContext);

  this.params = params; // and holder to keep reference to attributes
};

module.exports = AbstractTimeContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL2Fic3RyYWN0LXRpbWUtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJNLG1CQUFtQixHQUNaLFNBRFAsbUJBQW1CLENBQ1gsTUFBTSxFQUFFO3dCQURoQixtQkFBbUI7O0FBRXJCLE1BQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0NBQ3RCOztBQUdILE1BQU0sQ0FBQyxPQUFPLEdBQUcsbUJBQW1CLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvYWJzdHJhY3QtdGltZS1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAY2xhc3MgVGltZUNvbnRleHRcbiAqXG4gKiBBIFRpbWVDb250ZXh0IGluc3RhbmNlIHJlcHJlc2VudHMgYSB0aW1lIHNlZ21lbnQgYW5kIGl0cyBob3Jpem9udGFsIHNjYWxlIHRvIHRoZSBwaXhlbCBkb21haW4uXG4gKiBBIHRpbWVDb250ZXh0IGlzIGF0dGFjaGVkIHRvIGEgYFRpbWVsaW5lYCBpbnN0YW5jZSBvciBpdHMgYExheWVyYC5cbiAqIFdoZW4gYXR0YWNoZWQgdG8gYSBsYXllciwgYSB0aW1lQ29udGV4dCBoYXMgYSBwYXJlbnQgdGltZUNvbnRleHQsIHRoZSBvbmUgYXR0YWNoZWQgdG8gdGhlIHRpbWVsaW5lIGl0IGJlbG9uZ3MgdG8uXG4gKlxuICogQSB0aW1lQ29udGV4dCBoYXMgZm91ciBpbXBvcnRhbnRzIGF0dHJpYnV0ZXM6XG4gKiAtIHRpbWVDb250ZXh0LnN0YXJ0IHdoaWNoIGRlZmluZXMgdGhlIHN0YXJ0IHRpbWUgb2YgdGhlIGNvbnRleHQgaW4gc2Vjb25kcy5cbiAqICAgLSBGcm9tIGEgbGF5ZXIgcGVyc3BlY3RpdmUsIHRoaXMgY291bGQgYmUgdGhlIHRpbWUgYXQgd2hpY2ggdGVtcG9yYWwgZGF0YSBtdXN0IGJlIHJlcHJlc2VudGVkIGluIHRoZSB0aW1lbGluZSAoZm9yIGluc3RhbmNlIHRoZSBiZWdpbmluZyBvZiBhIHNvdW5kZmlsZSBpbiBhIERBVykuXG4gKiAgIC0gRnJvbSBhIHRpbWVsaW5lIHBlcnNwZWN0aXZlLCB0aGlzIHdpbGwgYWx3YXlzIGJlIDAuXG4gKiAtIHRpbWVDb250ZXh0Lm9mZnNldCB3aGljaCBkZWZpbmVzIHRoZSBvZmZzZXQgdGltZSBvZiB0aGUgY29udGV4dCBpbiBzZWNvbmRzLlxuICogICAtIEZyb20gYSB0aW1lbGluZSBwZXJzcGVjdGl2ZSwgaXQgaXMgYSB3YXkgdG8gaGF2ZSBhIHdpbmRvdyB2aWV3IHVwb24gYSBsYXJnZSB0aW1lbGluZSBmb3IgaW5zdGFuY2UuXG4gKiAgIC0gRnJvbSBhIGxheWVyIHBlcnNwZWN0aXZlLCB0aGlzIGNvdWxkIGJlIHRoZSBvZmZzZXQgdGltZSBvZiB0aGUgZGF0YSBpbiB0aGUgY29udGV4dCBvZiBhIExheWVyIChAVE9ETyBnaXZlIGEgdXNlIGNhc2UgZXhhbXBsZSBoZXJlIFwiY3JvcCA/XCIsIGFuZC9vciBleHBsYWluIHRoYXQgaXQncyBub3QgYSBjb21tb24gdXNlIGNhc2UpLlxuICogLSB0aW1lQ29udGV4dC5kdXJhdGlvbiB3aGljaCBkZWZpbmVzIHRoZSBkdXJhdGlvblxuICogICAtIEZyb20gYSBsYXllciBwZXJzcGVjdGl2ZSwgdGhpcyBpcyB0aGUgZHVyYXRpb24gb2YgdGhlIHRlbXBvcmFsIGRhdGEgKGVnLiB0aGUgZHVyYXRpb24gb2YgYSBzb3VuZGZpbGUpXG4gKiAgIC0gRnJvbSBhIHRpbWVsaW5lIHBlcnNwZWN0aXZlLCB0aGlzIGlzIHRoZSBvdmVyYWxsIGR1cmF0aW9uIG9mIHRoZSB0aW1lbGluZVxuICogLSB0aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gd2hpY2ggZGVmaW5lcyB0aGUgc3RyZXRjaCBhcHBsaWVkXG4gKiAgIC0gRnJvbSBhIHRpbWVsaW5lIHBlcnNwZWN0aXZlLCB0aGlzIGlzIHpvb20gZmFjdG9yIHdlIGFwcGx5IHRvIHRoZSB0aW1lbGluZVxuICogICAtIEZyb20gYSBsYXllciBwZXJzcGVjdGl2ZSwgdGhpcyBpcyBhIHdheSB0byBzdHJldGNoIHRoZSBkYXRhcy5cbiAqL1xuY2xhc3MgQWJzdHJhY3RUaW1lQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zOyAvLyBhbmQgaG9sZGVyIHRvIGtlZXAgcmVmZXJlbmNlIHRvIGF0dHJpYnV0ZXNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEFic3RyYWN0VGltZUNvbnRleHQ7XG4iXX0=