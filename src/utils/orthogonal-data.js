/**
 * OrthogonalData transforms an object of arrays `{foo: [1, 2], bar: [3, 4]}`
 * to or from an array of objects `[{foo: 1, bar: 3}, {foo: 2, bar: 4}]`
 */
export default class OrthogonalData {
  constructor() {
    this._cols = null; // Object of arrays
    this._rows = null; // Array of objects
  }

  /**
   * Check the consistency of the data.
   */
  _checkConsistency() {
    let size = null;

    for (let key in this._cols) {
      const col = this._cols[key];
      const colLength = col.length;

      if (size !== null && size !== colLength) {
        throw new Error(`${this.prototype.constructor.name}: inconsistent data`);
      } else if (size === null) {
        size = colLength;
      }
    }
  }

  /**
   * Updates array of objects from object of arrays.
   */
  updateFromCols() {
    let keys = Object.keys(this._cols);

    keys.forEach((key, i) => {
      const col = this._cols[key];

      col.forEach((value, index) => {
        if (this._rows[index] === undefined) this._rows[index] = {};
        this._rows[index][key] = value;
      });
    });

    this._checkConsistency();
  }

  /**
   * Updates object of arrays from array of objects.
   */
  updateFromRows() {
    this._rows.forEach((obj, index) => {
      for (let key in obj) {
        if (index === 0) this._cols[key] = [];
        this._cols[key].push(obj[key]);
      }
    });

    this._checkConsistency();
  }

  /**
   * Sets an object of arrays.
   *
   * @type {Object<String, Array>}
   */
  set cols(obj) {
    this._cols = obj;
    this._rows = [];

    this.updateFromCols();
  }

  /**
   * Returns an object of arrays.
   *
   * @type {Object<String, Array>}
   */
  get cols() {
    return this._cols;
  }

  /**
   * Sets an array of objects.
   *
   * @type {Array<Object>}
   */
  set rows(arr) {
    this._rows = arr;
    this._cols = {};

    this.updateFromRows();
  }

  /**
   * Returns an array of objects.
   *
   * @type {Array<Object>}
   */
  get rows() {
    return this._rows;
  }
}
