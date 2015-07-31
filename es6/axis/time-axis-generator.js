import { padLeft } from '../utils/format';
/**
 * maybe create a factory to give some parameters
 * create time serie data, to visualize a time scale
 */
export default function timeGenerator(timeContext) {
  const duration = timeContext.visibleDuration;
  const offset = timeContext.offset;
  const data = [];

  // const min = Math.min(-offset, 0);
  const min = - offset;
  // remove the timeline's offset to keep the layer centered
  const max = duration - offset;

  // define pixels for 1 second
  const ps = timeContext.computedPixelsPerSecond;
  const minStep = 7;

  // define all display information according to the pixelsPerSecond ratio
  let step, type, toFixed, markerModulo, includeModulo;

  if (ps * 4 > minStep) {
    step = 1; // the step to use to compute time
    toFixed = 0;
    markerModulo = 60; // a timestamp every 5 steps
    includeModulo = 5; // a tick every 5 steps
    type = '60sec';
  }

  if (ps * 2 > minStep) {
    step = 1;
    toFixed = 0;
    markerModulo = 30;
    includeModulo = 2;
    type = '30sec';
  }

  if (ps > minStep) {
    step = 1;
    toFixed = 0;
    markerModulo = 10;
    includeModulo = 1;
    type = 'sec';
  }

  if (ps / 10 > minStep) {
    step = 1 / 10;
    toFixed = 1;
    markerModulo = 10;
    includeModulo = 1;
    type = 'ds';
  }

  if (ps / 100 > minStep) {
    step = 1 / 100;
    toFixed = 2;
    markerModulo = 10;
    includeModulo = 1;
    type = 'cs';
  }

  if (ps / 1000 > minStep) {
    step = 1 / 1000;
    toFixed = 3;
    markerModulo = 10;
    includeModulo = 1;
    type = 'ms';
  }

  for (let time = min; time < max; time += step) {
    const formattedTime = time.toFixed(toFixed);

    if (Math.round(formattedTime / step) % includeModulo !== 0) {
      continue;
    }

    // avoid floating point errors
    const focused = Math.round(formattedTime / step) % markerModulo === 0 ? true : false;

    const datum = { x: formattedTime, focused };

    if (focused === true) {
      const date = new Date(1000 * formattedTime);
      const min = padLeft(date.getMinutes(), 0, 2);
      const sec = padLeft(date.getSeconds(), 0, 2);
      const milli = padLeft(date.getMilliseconds(), 0, 3);
      const label = `${min}:${sec}:${milli}`;

      datum.label = label;
    }

    data.push(datum);
  }

  return data;
}