import BaseShape from './base-shape';


const xhtmlNS = 'http://www.w3.org/1999/xhtml';

/**
 * A shape to display a waveform. (for entity data)
 *
 * [example usage](./examples/layer-waveform.html)
 *
 * @todo - fix problems with canvas strategy.
 */
export default class Waveform extends BaseShape {
  getClassName() { return 'waveform'; }

  _getAccessorList() {
    // return { y: 0 };
    return {};
  }

  _getDefaults() {
    return {
      sampleRate: 44100,
      color: '#000000',
      opacity: 1,
      // renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
    };
  }

  render(renderingContext) {
    if (this.$el) { return this.$el; }

    // if (this.params.renderingStrategy === 'svg') {

      this.$el = document.createElementNS(this.ns, 'path');
      this.$el.setAttributeNS(null, 'fill', 'none');
      this.$el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.$el.setAttributeNS(null, 'stroke', this.params.color);
      this.$el.style.opacity = this.params.opacity;

    // } else if (this.params.renderingStrategy === 'canvas') {

    //   this.$el = document.createElementNS(this.ns, 'foreignObject');
    //   this.$el.setAttributeNS(null, 'width', renderingContext.width);
    //   this.$el.setAttributeNS(null, 'height', renderingContext.height);

    //   const canvas = document.createElementNS(xhtmlNS, 'xhtml:canvas');

    //   this._ctx = canvas.getContext('2d');
    //   this._ctx.canvas.width = renderingContext.width;
    //   this._ctx.canvas.height = renderingContext.height;

    //   this.$el.appendChild(canvas);
    // }

    return this.$el;
  }

  update(renderingContext, datum) {
    // define nbr of samples per pixels
    const sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';
    const nbrSamples = datum.length;
    const duration = nbrSamples / this.params.sampleRate;
    const width = renderingContext.timeToPixel(duration);
    const samplesPerPixel = nbrSamples / width;

    if (!samplesPerPixel || datum.length < samplesPerPixel) { return; }

    // compute/draw visible area only
    // @TODO refactor this ununderstandable mess
    let minX = Math.max(-renderingContext.offsetX, 0);
    let trackDecay = renderingContext.trackOffsetX + renderingContext.startX;
    if (trackDecay < 0) { minX = -trackDecay; }

    let maxX = minX;
    maxX += (renderingContext.width - minX < renderingContext.visibleWidth) ?
      renderingContext.width : renderingContext.visibleWidth;

    // get min/max per pixels, clamped to the visible area
    const invert = renderingContext.timeToPixel.invert;
    const sampleRate = this.params.sampleRate;
    const minMax = [];

    for (let px = minX; px < maxX; px++) {
      const startTime = invert(px);
      const startSample = startTime * sampleRate;
      const extract = datum[sliceMethod](startSample, startSample + samplesPerPixel);

      let min = Infinity;
      let max = -Infinity;

      for (let j = 0, l = extract.length; j < l; j++) {
        let sample = extract[j];
        if (sample < min) { min = sample; }
        if (sample > max) { max = sample; }
      }
      // disallow Infinity
      min = !isFinite(min) ? 0 : min;
      max = !isFinite(max) ? 0 : max;
      if (min === 0 && max === 0) { continue; }

      minMax.push([px, min, max]);
    }

    if (!minMax.length) { return; }

    const PIXEL = 0;
    const MIN   = 1;
    const MAX   = 2;
    const ZERO  = renderingContext.valueToPixel(0);
    // rendering strategies
    // if (this.params.renderingStrategy === 'svg') {

      let instructions = minMax.map((datum, index) => {
        const x  = datum[PIXEL];
        let y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
        let y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));
        // return `${x},${ZERO}L${x},${y1}L${x},${y2}L${x},${ZERO}`;
        return `${x},${y1}L${x},${y2}`;
      });

      const d = 'M' + instructions.join('L');
      this.$el.setAttributeNS(null, 'd', d);

    // } else if (this.params.renderingStrategy === 'canvas') {

    //   this._ctx.canvas.width = width;
    //   this.$el.setAttribute('width', width);
    //   // fix chrome bug with translate
    //   if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    //     this.$el.setAttribute('x', renderingContext.offsetX);
    //   }

    //   this._ctx.strokeStyle = this.params.color;
    //   this._ctx.globalAlpha = this.params.opacity;
    //   this._ctx.moveTo(renderingContext.timeToPixel(0), renderingContext.valueToPixel(0));

    //   minMax.forEach((datum) => {
    //     const x  = datum[PIXEL];
    //     let y1 = Math.round(renderingContext.valueToPixel(datum[MIN]));
    //     let y2 = Math.round(renderingContext.valueToPixel(datum[MAX]));

    //     this._ctx.moveTo(x, y1);
    //     this._ctx.lineTo(x, y2);
    //   });

    //   this._ctx.stroke();
    // }
  }
}
