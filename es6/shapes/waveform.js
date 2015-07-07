const BaseShape = require('./base-shape');
const xhtmlNS = 'http://www.w3.org/1999/xhtml';

// @TODO creates strategies object to clean the `if...else` mess
class Waveform extends BaseShape {
  getClassName() { return 'waveform'; }

  _getAccessorList() {
    return { y: 0 };
  }

  _getDefaults() {
    return {
      sampleRate: 44100,
      color: '#000000',
      opacity: 1,
      renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
    };
  }

  render(renderingContext) {
    if (this.el) { return this.el; }

    if (this.params.renderingStrategy === 'svg') {

      this.el = document.createElementNS(this.ns, 'path');
      this.el.setAttributeNS(null, 'fill', 'none');
      this.el.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      this.el.setAttributeNS(null, 'stroke', this.params.color);
      this.el.style.opacity = this.params.opacity;

    } else if (this.params.renderingStrategy === 'canvas') {

      this.el = document.createElementNS(this.ns, 'foreignObject');
      this.el.setAttributeNS(null, 'width', renderingContext.width);
      this.el.setAttributeNS(null, 'height', renderingContext.height);

      const canvas = document.createElementNS(xhtmlNS, 'xhtml:canvas');

      this._ctx = canvas.getContext('2d');
      this._ctx.canvas.width = renderingContext.width;
      this._ctx.canvas.height = renderingContext.height;

      this.el.appendChild(canvas);
    }

    return this.el;
  }

  update(renderingContext, group, datum, index) {
    // define nbr of samples per pixels
    const sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';
    const nbrSamples = datum.length;
    const duration = nbrSamples / this.params.sampleRate;
    const width = renderingContext.xScale(duration);
    const samplesPerPixel = nbrSamples / width;
    let minMax = [];
    // get min/max per pixels
    for (let i = 0; i <= width; i++) {
      const startTime = renderingContext.xScale.invert(i);
      const startSample = startTime * this.params.sampleRate;

      const extract = datum[sliceMethod](startSample, startSample + samplesPerPixel);
      let min = Infinity;
      let max = -Infinity;
      for (let j = 0; j < extract.length; j++) {
        let sample = extract[j];
        if (sample < min) { min = sample; }
        if (sample > max) { max = sample; }
      }
      // disallow Infinity
      min = (min === Infinity || min === -Infinity) ? 0 : min;
      max = (max === Infinity || max === -Infinity) ? 0 : max;

      minMax.push({ time: startTime, values: [min, max] });
    }

    const MIN = 0;
    const MAX = 1;

    // rednering strategies
    if (this.params.renderingStrategy === 'svg') {

      let instructions = minMax.map((datum, index) => {
        const x  = Math.floor(renderingContext.xScale(datum.time));
        let y1 = Math.round(renderingContext.yScale(this.y(datum.values[MIN])));
        let y2 = Math.round(renderingContext.yScale(this.y(datum.values[MAX])));

        return `${x},${y1}L${x},${y2}`;
      });

      const d = 'M' + instructions.join('L');
      this.el.setAttributeNS(null, 'd', d);

    } else if (this.params.renderingStrategy === 'canvas') {

      this._ctx.canvas.width = width;
      this.el.setAttribute('width', width);
      // fix chrome bug with translate
      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        this.el.setAttribute('x', renderingContext.offsetX);
      }

      this._ctx.strokeStyle = this.params.color;
      this._ctx.globalAlpha = this.params.opacity;
      this._ctx.moveTo(renderingContext.xScale(0), renderingContext.yScale(0));

      minMax.forEach((datum) => {
        const x  = renderingContext.xScale(datum.time);
        const y1 = renderingContext.yScale(this.y(datum.values[MIN]));
        const y2 = renderingContext.yScale(this.y(datum.values[MAX]));

        this._ctx.moveTo(x, y1);
        this._ctx.lineTo(x, y2);
      });

      this._ctx.stroke();
    }
  }
}

module.exports = Waveform;
