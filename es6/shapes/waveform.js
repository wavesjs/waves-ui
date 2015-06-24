var BaseShape = require('./base-shape');

class Waveform extends BaseShape {
  _getAccessorList() {
    return { y: 0, sampleRate: 1000 };
  }

  _getDefaults() {
    return {
      color: '#000000',
      opacity: 1,
      renderingStrategy: 'svg' // canvas is bugged (translation, etc...)
    };
  }

  render(renderingContext) {
    if (this.shape) { return this.shape; }

    if (this.params.renderingStrategy === 'svg') {
      this.shape = document.createElementNS(this.ns, 'path');
      this.shape.setAttributeNS(null, 'fill', 'none');
      this.shape.setAttributeNS(null, 'stroke', 'steelblue');
      this.shape.setAttributeNS(null, 'shape-rendering', 'crispEdges');
    } else if (this.params.renderingStrategy === 'canvas') {
      this.shape = document.createElementNS(this.ns, 'foreignObject');
      // this.shape.setAttribute('requiredExtensions', 'http://www.w3.org/1999/xhtml');
      // this.shape.setAttribute('width', renderingContext.width);
      // this.shape.setAttribute('height', renderingContext.height);

      const canvas = document.createElement('canvas');
      this.ctx = canvas.getContext('2d');

      this.ctx.canvas.width = renderingContext.width;
      this.ctx.canvas.height = renderingContext.height;

      this.shape.appendChild(canvas);
    }

    this.shape.style.opacity = this.params.opacity;

    return this.shape;
  }

  update(renderingContext, group, datum, index) {
    // define nbr of samples per pixels
    const sliceMethod = datum instanceof Float32Array ? 'subarray' : 'slice';
    const nbrSamples = datum.length;
    const duration = nbrSamples / this.sampleRate(datum);
    const width = renderingContext.xScale(duration);
    const samplesPerPixel = nbrSamples / width;
    let minMax = [];
    // console.log(datum, datum instanceof Float32Array);
    // get min/max per pixels
    for (let i = 0; i <= width; i++) {
      const startTime = renderingContext.xScale.invert(i);
      const startSample = startTime * this.sampleRate(datum);

      const extract = datum[sliceMethod](startSample, startSample + samplesPerPixel);
      let min = Infinity;
      let max = -Infinity;
      for (let j = 0; j < extract.length; j++) {
        let sample = extract[j];
        if (sample < min) { min = sample; }
        if (sample > max) { max = sample; }
      }

      minMax.push({ time: startTime, values: [min, max] });
    }

    const MIN = 0;
    const MAX = 1;

    // rednering strategies
    if (this.params.renderingStrategy === 'svg') {
      let instructions = minMax.map((datum, index) => {
        const x  = renderingContext.xScale(datum.time);
        const y1 = renderingContext.yScale(this.y(datum.values[MIN]));
        const y2 = renderingContext.yScale(this.y(datum.values[MAX]));

        return `${x},${y1}L${x},${y2}`;
      });

      const d = 'M' + instructions.join('L');

      this.shape.setAttributeNS(null, 'd', d);
    } else if (this.params.renderingStrategy === 'canvas') {
      this.ctx.strokeStyle = this.params.color;
      this.ctx.globalAlpha = this.params.opacity;
      this.ctx.moveTo(renderingContext.xScale(0), renderingContext.yScale(0));

      minMax.forEach((datum) => {
        const x  = renderingContext.xScale(datum.time);
        const y1 = renderingContext.yScale(this.y(datum.values[MIN]));
        const y2 = renderingContext.yScale(this.y(datum.values[MAX]));

        this.ctx.lineTo(x, y1);
        this.ctx.lineTo(x, y2);
      });

      this.ctx.stroke();
    }
  }
}

module.exports = Waveform;
