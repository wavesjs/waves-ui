const Marker = require('./marker');

class AnnotatedMarker extends Marker {
  _getAccessorList() {
    let list = super._getAccessorList();
    list.text = 'default';
    return list;
  }

  render(context) {
    this.shape = super.render(context);
    const height = context.params.height;

    this.label = document.createElementNS(this.ns, 'text');
    this.label.setAttributeNS(null, 'x', 10);
    this.label.setAttributeNS(null, 'y', 10);
    this.label.setAttributeNS(null, 'transform', `matrix(1, 0, 0, -1, 0, ${height})`);
    this.label.style.fontSize = '10px';
    this.label.style.fontFamily = 'monospace';
    this.label.style.color = '#676767';
    this.label.style.mozUserSelect = 'none';
    this.label.style.webkitUserSelect = 'none';
    this.label.style.userSelect = 'none';

    this.shape.appendChild(this.label);

    return this.shape;
  }

  update(context, group, datum, index) {
    super.update(context, group, datum, index);

    this.label.innerHTML = this.text(datum);
  }
}

module.exports = AnnotatedMarker;