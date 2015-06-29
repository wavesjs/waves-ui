class OrthogonalData {
  constructor() {
    this._cols = null; // object of arrays
    this._rows = null; // array of objects
  }

  // verify that data are consistents
  _checkConsistency() {
    let size = null;

    for (let key in this._cols) {
      const col = this._cols[key];
      const colLength = col.length;

      if (size !== null && size !== colLength) {
        throw new Error(`${this.__proto__.constructor.name}: inconsistent data`);
      } else if (size === null) {
        size = colLength;
      }
    }
  }

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

  updateFromRows() {
    this._rows.forEach((obj, index) => {
      for (let key in obj) {
        if (index === 0) this._cols[key] = [];
        this._cols[key].push(obj[key]);
      }
    });

    this._checkConsistency();
  }

  set cols(obj) {
    this._cols = obj;
    this._rows = [];

    this.updateFromCols();
  }

  set rows(arr) {
    this._rows = arr;
    this._cols = {};

    this.updateFromRows();
  }

  get cols() {
    return this._cols;
  }

  get rows() {
    return this._rows;
  }
}

module.exports = OrthogonalData;
