import BaseShape from './base-shape';

/**
 * Kind of Marker for entity oriented data. Usefull to display a grid.
 */
export default class Ticks extends BaseShape {
  _getClassName() {
    return 'tick';
  }

  _getAccessorList() {
    return { time: 0, focused: true, label: '' };
  }

  _getDefaults() {
    return {
      color: 'steelblue',
      focusedOpacity: 0.8,
      defaultOpacity: 0.3
    };
  }

  render(renderingContext) {
    this.$el = document.createElementNS(this.ns, 'g');
    return this.$el;
  }

  update(renderingContext, data) {
    while (this.$el.firstChild) {
      this.$el.removeChild(this.$el.firstChild);
    }

    const fragment = document.createDocumentFragment();
    const layerHeight = renderingContext.height; // valueToPixel(1);

    data.forEach((datum) => {
      const x = renderingContext.timeToPixel(this.time(datum));
      const opacity = this.focused(datum) ?
        this.params.focusedOpacity : this.params.defaultOpacity;

      const height = layerHeight;

      const tick = document.createElementNS(this.ns, 'line');
      tick.classList.add('tick');

      tick.setAttributeNS(null, 'x1', 0);
      tick.setAttributeNS(null, 'x2', 0);
      tick.setAttributeNS(null, 'y1', 0);
      tick.setAttributeNS(null, 'y2', height);

      tick.setAttributeNS(null, 'fill', 'none');
      tick.setAttributeNS(null, 'stroke', this.params.color);
      tick.setAttributeNS(null, 'shape-rendering', 'crispEdges');
      tick.setAttributeNS(null, 'transform', `translate(${x}, 0)`);
      tick.setAttributeNS(null, 'opacity', opacity);

      this.$el.appendChild(tick);

      const label = this.label(datum);
      if (label) {
        const $label = document.createElementNS(this.ns, 'text');
        $label.classList.add('label');
        const $text = document.createTextNode(label);
        $label.appendChild($text);
        $label.setAttributeNS(null, 'transform', `matrix(1, 0, 0, -1, ${x + 2}, ${height + 2})`);
        // firefox problem here
        // $label.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
        $label.setAttributeNS(null, 'y', '10');

        $label.style.fontSize = '10px';
        $label.style.lineHeight = '10px';
        $label.style.fontFamily = 'monospace';
        $label.style.color = '#676767';
        $label.style.opacity = 0.9;
        $label.style.mozUserSelect = 'none';
        $label.style.webkitUserSelect = 'none';
        $label.style.userSelect = 'none';

        // const bg = document.createElementNS(this.ns, 'rect');
        // bg.setAttributeNS(null, 'width', '100%');
        // bg.setAttributeNS(null, 'height', '100%');
        // bg.setAttributeNS(null, 'fill', '#ffffff');
        // label.appendChild(bg);

        this.$el.appendChild($label);
      }
    });

    this.$el.appendChild(fragment);
  }
}