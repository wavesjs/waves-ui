import Segment from './segment';


/**
 * A shape to display a segment with annotation.
 *
 * [example usage](./examples/layer-segment.html)
 */
export default class AnnotatedSegment extends Segment {
  getClassName() { return 'annotated-segment'; }

  _getAccessorList() {
    let list = super._getAccessorList();
    list.text = 'default';
    return list;
  }

  render(renderingContext) {
    this.$el = super.render(renderingContext);
    const height = renderingContext.height;

    this.$label = document.createElementNS(this.ns, 'text');
    this.$label.setAttributeNS(null, 'x', 3);
    this.$label.setAttributeNS(null, 'y', 11);
    this.$label.setAttributeNS(null, 'transform', `matrix(1, 0, 0, -1, 0, ${height})`);
    this.$label.style.fontSize = '10px';
    this.$label.style.fontFamily = 'monospace';
    this.$label.style.color = '#242424';
    this.$label.style.mozUserSelect = 'none';
    this.$label.style.webkitUserSelect = 'none';
    this.$label.style.userSelect = 'none';

    this.$el.appendChild(this.$label);

    return this.$el;
  }

  update(renderingContext, datum) {
    super.update(renderingContext, datum);

    if (this.$label.firstChild) {
      this.$label.removeChild(this.$label.firstChild);
    }

    const $text = document.createTextNode(this.text(datum));
    this.$label.appendChild($text);
  }
}
