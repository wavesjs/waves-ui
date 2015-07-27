"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var OrthogonalData = (function () {
  function OrthogonalData() {
    _classCallCheck(this, OrthogonalData);

    this._cols = null; // object of arrays
    this._rows = null; // array of objects
  }

  _createClass(OrthogonalData, {
    _checkConsistency: {

      // verify that data are consistents

      value: function _checkConsistency() {
        var size = null;

        for (var key in this._cols) {
          var col = this._cols[key];
          var colLength = col.length;

          if (size !== null && size !== colLength) {
            throw new Error("" + this.prototype.constructor.name + ": inconsistent data");
          } else if (size === null) {
            size = colLength;
          }
        }
      }
    },
    updateFromCols: {
      value: function updateFromCols() {
        var _this = this;

        var keys = _core.Object.keys(this._cols);

        keys.forEach(function (key, i) {
          var col = _this._cols[key];

          col.forEach(function (value, index) {
            if (_this._rows[index] === undefined) _this._rows[index] = {};
            _this._rows[index][key] = value;
          });
        });

        this._checkConsistency();
      }
    },
    updateFromRows: {
      value: function updateFromRows() {
        var _this = this;

        this._rows.forEach(function (obj, index) {
          for (var key in obj) {
            if (index === 0) _this._cols[key] = [];
            _this._cols[key].push(obj[key]);
          }
        });

        this._checkConsistency();
      }
    },
    cols: {
      set: function (obj) {
        this._cols = obj;
        this._rows = [];

        this.updateFromCols();
      },
      get: function () {
        return this._cols;
      }
    },
    rows: {
      set: function (arr) {
        this._rows = arr;
        this._cols = {};

        this.updateFromRows();
      },
      get: function () {
        return this._rows;
      }
    }
  });

  return OrthogonalData;
})();

module.exports = OrthogonalData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFBcUIsY0FBYztBQUN0QixXQURRLGNBQWMsR0FDbkI7MEJBREssY0FBYzs7QUFFL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7R0FDbkI7O2VBSmtCLGNBQWM7QUFPakMscUJBQWlCOzs7O2FBQUEsNkJBQUc7QUFDbEIsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVoQixhQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDMUIsY0FBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixjQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDOztBQUU3QixjQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUN2QyxrQkFBTSxJQUFJLEtBQUssTUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLHlCQUFzQixDQUFDO1dBQzFFLE1BQU0sSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ3hCLGdCQUFJLEdBQUcsU0FBUyxDQUFDO1dBQ2xCO1NBQ0Y7T0FDRjs7QUFFRCxrQkFBYzthQUFBLDBCQUFHOzs7QUFDZixZQUFJLElBQUksR0FBRyxNQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQyxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLENBQUMsRUFBSztBQUN2QixjQUFNLEdBQUcsR0FBRyxNQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFNUIsYUFBRyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7QUFDNUIsZ0JBQUksTUFBSyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssU0FBUyxFQUFFLE1BQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM1RCxrQkFBSyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1dBQ2hDLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQzs7QUFFSCxZQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztPQUMxQjs7QUFFRCxrQkFBYzthQUFBLDBCQUFHOzs7QUFDZixZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUs7QUFDakMsZUFBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUU7QUFDbkIsZ0JBQUksS0FBSyxLQUFLLENBQUMsRUFBRSxNQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdEMsa0JBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztXQUNoQztTQUNGLENBQUMsQ0FBQzs7QUFFSCxZQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztPQUMxQjs7QUFnQkcsUUFBSTtXQWRBLFVBQUMsR0FBRyxFQUFFO0FBQ1osWUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsWUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0FBRWhCLFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUN2QjtXQVNPLFlBQUc7QUFDVCxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDbkI7O0FBRUcsUUFBSTtXQVhBLFVBQUMsR0FBRyxFQUFFO0FBQ1osWUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7QUFDakIsWUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0FBRWhCLFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUN2QjtXQU1PLFlBQUc7QUFDVCxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7T0FDbkI7Ozs7U0FwRWtCLGNBQWM7OztpQkFBZCxjQUFjIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBPcnRob2dvbmFsRGF0YSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NvbHMgPSBudWxsOyAvLyBvYmplY3Qgb2YgYXJyYXlzXG4gICAgdGhpcy5fcm93cyA9IG51bGw7IC8vIGFycmF5IG9mIG9iamVjdHNcbiAgfVxuXG4gIC8vIHZlcmlmeSB0aGF0IGRhdGEgYXJlIGNvbnNpc3RlbnRzXG4gIF9jaGVja0NvbnNpc3RlbmN5KCkge1xuICAgIGxldCBzaXplID0gbnVsbDtcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9jb2xzKSB7XG4gICAgICBjb25zdCBjb2wgPSB0aGlzLl9jb2xzW2tleV07XG4gICAgICBjb25zdCBjb2xMZW5ndGggPSBjb2wubGVuZ3RoO1xuXG4gICAgICBpZiAoc2l6ZSAhPT0gbnVsbCAmJiBzaXplICE9PSBjb2xMZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWV9OiBpbmNvbnNpc3RlbnQgZGF0YWApO1xuICAgICAgfSBlbHNlIGlmIChzaXplID09PSBudWxsKSB7XG4gICAgICAgIHNpemUgPSBjb2xMZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlRnJvbUNvbHMoKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9jb2xzKTtcblxuICAgIGtleXMuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCBjb2wgPSB0aGlzLl9jb2xzW2tleV07XG5cbiAgICAgIGNvbC5mb3JFYWNoKCh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3Jvd3NbaW5kZXhdID09PSB1bmRlZmluZWQpIHRoaXMuX3Jvd3NbaW5kZXhdID0ge307XG4gICAgICAgIHRoaXMuX3Jvd3NbaW5kZXhdW2tleV0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY2hlY2tDb25zaXN0ZW5jeSgpO1xuICB9XG5cbiAgdXBkYXRlRnJvbVJvd3MoKSB7XG4gICAgdGhpcy5fcm93cy5mb3JFYWNoKChvYmosIGluZGV4KSA9PiB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkgdGhpcy5fY29sc1trZXldID0gW107XG4gICAgICAgIHRoaXMuX2NvbHNba2V5XS5wdXNoKG9ialtrZXldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2NoZWNrQ29uc2lzdGVuY3koKTtcbiAgfVxuXG4gIHNldCBjb2xzKG9iaikge1xuICAgIHRoaXMuX2NvbHMgPSBvYmo7XG4gICAgdGhpcy5fcm93cyA9IFtdO1xuXG4gICAgdGhpcy51cGRhdGVGcm9tQ29scygpO1xuICB9XG5cbiAgc2V0IHJvd3MoYXJyKSB7XG4gICAgdGhpcy5fcm93cyA9IGFycjtcbiAgICB0aGlzLl9jb2xzID0ge307XG5cbiAgICB0aGlzLnVwZGF0ZUZyb21Sb3dzKCk7XG4gIH1cblxuICBnZXQgY29scygpIHtcbiAgICByZXR1cm4gdGhpcy5fY29scztcbiAgfVxuXG4gIGdldCByb3dzKCkge1xuICAgIHJldHVybiB0aGlzLl9yb3dzO1xuICB9XG59XG4iXX0=