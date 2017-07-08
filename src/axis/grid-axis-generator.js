/**
 * A generator to create data for grid axis according to a `bpm` and a `meter`.
 *
 * [example usage](./examples/layer-axis.html)
 *
 * @param {Number} bpm - The number of beats per minutes.
 * @param {String} signature - The meter of the mesure (`'4/4'`, `'3/8'`, ...).
 * @return {Function} - The configured function returning the data when called.
 */
export default function gridAxisGenerator(bpm, signature) {
  const _bps =  bpm / 60; // sec
  const _unit = 1 / parseInt(signature.split('/')[1], 10);
  const _nbrUnitsPerMesure = parseInt(signature.split('/')[0], 10);

  return function(timeContext) {
    const duration = timeContext.visibleDuration;
    const offset = timeContext.offset;
    const data = [];

    // const min = Math.min(-offset, 0);
    const min = - offset;
    // remove the timeline's offset to keep the layer centered
    const max = duration - offset;

    // define pixels for 1 second
    const pixelsPerSecond = timeContext.computedPixelsPerSecond;
    // time for one _unit
    const unitTime = 1 / _bps;
    // define the first tick > min
    const modulo = min % unitTime;
    const mult = (min - modulo) / unitTime;
    const firstTickTime = unitTime * mult;
    // track which position of current beat in the mesure
    let positionInMesure = mult % _nbrUnitsPerMesure;

    // remove not focused beats, if zoomed out
    const pixelsPerTick = pixelsPerSecond / _bps;
    const minStep = 5;

    // time should be
    for (let time = firstTickTime; time < max; time += unitTime) {
      // find first beat
      const focused = (positionInMesure++ % _nbrUnitsPerMesure === 0);
      // ignore if pixels per ticks is too small
      if ((pixelsPerTick <= minStep) && !focused) { continue; }

      data.push({ time, focused });
    }

    return data;
  };
}