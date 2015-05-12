var BaseShape = require('./base-shape');

class Waveform extends BaseShape {
  _getAccessorList() {
    return { y: 0, sampleRate: 1000 }
  }

  _getDefaults() {
    return {
      color: '#000000'
    }
  }

  render(context) {
    if (this.shape) { return this.shape; }

    this.shape = document.createElementNS(this.ns, 'path');
    this.shape.setAttributeNS(null, 'fill', 'none');
    this.shape.setAttributeNS(null, 'stroke', 'steelblue');
    this.shape.setAttributeNS(null, 'shape-rendering', 'crispEdges');

    return this.shape;
  }

  update(context, group, datum, index) {
    this.shape.setAttributeNS(null, 'd', '');

    // define nbr of samples per pixels
    const nbrSamples = datum.length;
    const duration = nbrSamples / this.sampleRate(datum);
    const width = context.xScale(duration);
    const samplesPerPixel = nbrSamples / width;
    let minMax = [];
    // get min/max per pixels
    for (let i = 0; i <= width; i++) {
      const startTime = context.xScale.invert(i);
      const startSample = startTime * this.sampleRate(datum);

      const extract = datum.slice(startSample, startSample + samplesPerPixel);
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
    // draw line
    let instructions = minMax.map((datum, index) => {
      const x  = context.xScale(datum.time);
      const y1 = context.yScale(this.y(datum.values[MIN]));
      const y2 = context.yScale(this.y(datum.values[MAX]));

      return `${x},${y1}L${x},${y2}`;
    });

    const d = 'M' + instructions.join('L');

    this.shape.setAttributeNS(null, 'd', d);
  }
}

module.exports = Waveform;