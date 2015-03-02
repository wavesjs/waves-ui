'use strict';

var UI = {
  // core
  timeline: require('./dist/core/timeline'),
  layer: require('./dist/core/layer'),
  // components
  breakpoint: require('./dist/components/breakpoint'),
  label: require('./dist/components/label'),
  marker: require('./dist/components/marker'),
  segment: require('./dist/components/segment'),
  waveform: require('./dist/components/waveform'),
  // utils
  zoomer: require('./dist/helpers/zoomer'),
  utils: require('./dist/helpers/utils'),
  // expose d3
  d3: require('d3')
}

module.exports = UI;