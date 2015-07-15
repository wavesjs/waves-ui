/**
 *
 */
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ViewCollection = (function (_Array) {
  function ViewCollection(timeline) {
    _classCallCheck(this, ViewCollection);

    _get(_core.Object.getPrototypeOf(ViewCollection.prototype), "constructor", this).call(this);

    this._timeline = timeline;
  }

  _inherits(ViewCollection, _Array);

  _createClass(ViewCollection, {
    offset: {
      set: function (value) {
        this.forEach(function (view) {
          return view.offset = value;
        });
      }
    },
    zoom: {
      set: function (value) {
        this.forEach(function (view) {
          return view.zoom = value;
        });
      }
    },
    width: {
      set: function (value) {
        this.forEach(function (view) {
          return view.width = value;
        });
      }
    },
    pixelsPerSecond: {
      set: function (value) {
        this.forEach(function (view) {
          return view.pixelsPerSecond = value;
        });
      }
    },
    maintainVisibleDuration: {
      set: function (value) {
        this.forEach(function (view) {
          return view.maintainVisibleDuration = value;
        });
      }
    },
    height: {

      // @NOTE keep this ?
      // could prepare some vertical resizing ability

      set: function (value) {
        this.forEach(function (view) {
          return view.height = value;
        });
      }
    },
    render: {
      value: function render() {
        this.forEach(function (view) {
          return view.render();
        });
        this._timeline.emit("render");
      }
    },
    update: {
      value: function update() {
        this.forEach(function (view) {
          return view.update();
        });
        this._timeline.emit("update");
      }
    },
    updateContainer: {
      value: function updateContainer() {
        this.forEach(function (view) {
          return view.updateContainer();
        });
        this._timeline.emit("update:containers");
      }
    },
    updateLayers: {
      value: function updateLayers() {
        this.forEach(function (view) {
          return view.updateLayers();
        });
        this._timeline.emit("update:layers");
      }
    }
  });

  return ViewCollection;
})(Array);

module.exports = ViewCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3ZpZXctY29sbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFHcUIsY0FBYztBQUN0QixXQURRLGNBQWMsQ0FDckIsUUFBUSxFQUFFOzBCQURILGNBQWM7O0FBRS9CLHFDQUZpQixjQUFjLDZDQUV2Qjs7QUFFUixRQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztHQUMzQjs7WUFMa0IsY0FBYzs7ZUFBZCxjQUFjO0FBTzdCLFVBQU07V0FBQSxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUs7U0FBQSxDQUFDLENBQUM7T0FDN0M7O0FBRUcsUUFBSTtXQUFBLFVBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7aUJBQUssSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLO1NBQUEsQ0FBQyxDQUFDO09BQzNDOztBQUVHLFNBQUs7V0FBQSxVQUFDLEtBQUssRUFBRTtBQUNmLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSztTQUFBLENBQUMsQ0FBQztPQUM1Qzs7QUFFRyxtQkFBZTtXQUFBLFVBQUMsS0FBSyxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSztTQUFBLENBQUMsQ0FBQztPQUN0RDs7QUFFRywyQkFBdUI7V0FBQSxVQUFDLEtBQUssRUFBRTtBQUNqQyxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsS0FBSztTQUFBLENBQUMsQ0FBQztPQUM5RDs7QUFJRyxVQUFNOzs7OztXQUFBLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSztTQUFBLENBQUMsQ0FBQztPQUM3Qzs7QUFFRCxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQ3RDLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQy9COztBQUVELFVBQU07YUFBQSxrQkFBRztBQUNQLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7U0FBQSxDQUFDLENBQUM7QUFDdEMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDL0I7O0FBRUQsbUJBQWU7YUFBQSwyQkFBRztBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsZUFBZSxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7T0FDMUM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUU7U0FBQSxDQUFDLENBQUM7QUFDNUMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7T0FDdEM7Ozs7U0FuRGtCLGNBQWM7R0FBUyxLQUFLOztpQkFBNUIsY0FBYyIsImZpbGUiOiJlczYvY29yZS92aWV3LWNvbGxlY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdDb2xsZWN0aW9uIGV4dGVuZHMgQXJyYXkge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl90aW1lbGluZSA9IHRpbWVsaW5lO1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy5vZmZzZXQgPSB2YWx1ZSk7XG4gIH1cblxuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy56b29tID0gdmFsdWUpO1xuICB9XG5cbiAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiB2aWV3LndpZHRoID0gdmFsdWUpO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy5waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZSk7XG4gIH1cblxuICBzZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24odmFsdWUpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSB2YWx1ZSk7XG4gIH1cblxuICAvLyBATk9URSBrZWVwIHRoaXMgP1xuICAvLyBjb3VsZCBwcmVwYXJlIHNvbWUgdmVydGljYWwgcmVzaXppbmcgYWJpbGl0eVxuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiB2aWV3LmhlaWdodCA9IHZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcucmVuZGVyKCkpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3JlbmRlcicpO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy51cGRhdGUoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlJyk7XG4gIH1cblxuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiB2aWV3LnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6Y29udGFpbmVycycpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy51cGRhdGVMYXllcnMoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmxheWVycycpO1xuICB9XG59Il19