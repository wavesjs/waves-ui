module.exports = {
  core: {
    LayerTimeContext    : require('./dist/core/layer-time-context'),
    Layer               : require('./dist/core/layer'),
    namespace           : require('./dist/core/namespace'),
    TimelineTimeContext : require('./dist/core/timeline-time-context'),
    Timeline            : require('./dist/core/timeline'),
    TrackCollection     : require('./dist/core/track-collection'),
    Track               : require('./dist/core/track'),
  },
  shapes: {
    AnnotatedMarker     : require('./dist/shapes/annotated-marker'),
    AnnotatedSegment    : require('./dist/shapes/annotated-segment'),
    BaseShape           : require('./dist/shapes/base-shape'),
    Cursor              : require('./dist/shapes/cursor'),
    Dot                 : require('./dist/shapes/dot'),
    Line                : require('./dist/shapes/line'),
    Marker              : require('./dist/shapes/marker'),
    Segment             : require('./dist/shapes/segment'),
    TraceCommon         : require('./dist/shapes/trace-common'),
    TraceDots           : require('./dist/shapes/trace-dots'),
    Waveform            : require('./dist/shapes/waveform'),
  },
  behaviors: {
    BaseBehavior        : require('./dist/behaviors/base-behavior'),
    BreakpointBehavior  : require('./dist/behaviors/breakpoint-behavior'),
    MarkerBehavior      : require('./dist/behaviors/marker-behavior'),
    SegmentBehavior     : require('./dist/behaviors/segment-behavior'),
    TimeContextBehavior : require('./dist/behaviors/time-context-behavior'),
    TraceBehavior       : require('./dist/behaviors/trace-behavior'),
  },
  interactions: {
    EventSource         : require('./dist/interactions/event-source'),
    Keyboard            : require('./dist/interactions/keyboard'),
    Surface             : require('./dist/interactions/surface'),
    WaveEvent           : require('./dist/interactions/wave-event'),
  },
  // rename folder ?
  states: {
    BaseState           : require('./dist/states/base-state'),
    BrushZoomState      : require('./dist/states/brush-zoom-state'),
    CenteredZoomState   : require('./dist/states/centered-zoom-state'),
    ContextEditionState : require('./dist/states/context-edition-state'),
    EditionState        : require('./dist/states/edition-state'),
    SelectionState      : require('./dist/states/selection-state'),
    SimpleEditionState  : require('./dist/states/simple-edition-state'),
  },
  helpers: {
    AnnotatedMarkerLayer: require('./dist/helpers/annotated-marker-layer'),
    CursorLayer         : require('./dist/helpers/cursor-layer'),
    DotLayer            : require('./dist/helpers/dot-layer'),
    MarkerLayer         : require('./dist/helpers/marker-layer'),
    SegmentLayer        : require('./dist/helpers/segment-layer'),
    WaveformLayer       : require('./dist/helpers/waveform-layer'),
  },
  utils: {
    OrthogonalData      : require('./dist/utils/orthogonal-data'),
  }
}
