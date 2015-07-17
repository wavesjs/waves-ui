/**
 * The `ViewCollection` class allow to update all timeline's views at once
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
    width: {

      // @NOTE keep this ?
      // could prepare some vertical resizing ability
      // this should be able to modify the layers yScale to be really usefull

      set: function (value) {
        this.forEach(function (view) {
          return view.width = value;
        });
      }
    },
    height: {
      set: function (value) {
        this.forEach(function (view) {
          return view.height = value;
        });
      }
    },
    layers: {

      // access layers

      get: function () {
        var layers = [];
        this.forEach(function (view) {
          return layers = layers.concat(view.layers);
        });

        return layers;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RyYWNrLWNvbGxlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0lBR3FCLGNBQWM7QUFDdEIsV0FEUSxjQUFjLENBQ3JCLFFBQVEsRUFBRTswQkFESCxjQUFjOztBQUUvQixxQ0FGaUIsY0FBYyw2Q0FFdkI7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7R0FDM0I7O1lBTGtCLGNBQWM7O2VBQWQsY0FBYztBQVU3QixTQUFLOzs7Ozs7V0FBQSxVQUFDLEtBQUssRUFBRTtBQUNmLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSztTQUFBLENBQUMsQ0FBQztPQUM1Qzs7QUFFRyxVQUFNO1dBQUEsVUFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7aUJBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLO1NBQUEsQ0FBQyxDQUFDO09BQzdDOztBQUdHLFVBQU07Ozs7V0FBQSxZQUFHO0FBQ1gsWUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7U0FBQSxDQUFDLENBQUM7O0FBRTVELGVBQU8sTUFBTSxDQUFDO09BQ2Y7O0FBRUQsVUFBTTthQUFBLGtCQUFHO0FBQ1AsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7aUJBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtTQUFBLENBQUMsQ0FBQztBQUN0QyxZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUMvQjs7QUFFRCxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQ3RDLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQy9COztBQUVELG1CQUFlO2FBQUEsMkJBQUc7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7aUJBQUssSUFBSSxDQUFDLGVBQWUsRUFBRTtTQUFBLENBQUMsQ0FBQztBQUMvQyxZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO09BQzFDOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7QUFDYixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQzVDLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO09BQ3RDOzs7O1NBNUNrQixjQUFjO0dBQVMsS0FBSzs7aUJBQTVCLGNBQWMiLCJmaWxlIjoiZXM2L2NvcmUvdHJhY2stY29sbGVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGBWaWV3Q29sbGVjdGlvbmAgY2xhc3MgYWxsb3cgdG8gdXBkYXRlIGFsbCB0aW1lbGluZSdzIHZpZXdzIGF0IG9uY2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld0NvbGxlY3Rpb24gZXh0ZW5kcyBBcnJheSB7XG4gIGNvbnN0cnVjdG9yKHRpbWVsaW5lKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3RpbWVsaW5lID0gdGltZWxpbmU7XG4gIH1cblxuICAvLyBATk9URSBrZWVwIHRoaXMgP1xuICAvLyBjb3VsZCBwcmVwYXJlIHNvbWUgdmVydGljYWwgcmVzaXppbmcgYWJpbGl0eVxuICAvLyB0aGlzIHNob3VsZCBiZSBhYmxlIHRvIG1vZGlmeSB0aGUgbGF5ZXJzIHlTY2FsZSB0byBiZSByZWFsbHkgdXNlZnVsbFxuICBzZXQgd2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcud2lkdGggPSB2YWx1ZSk7XG4gIH1cblxuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiB2aWV3LmhlaWdodCA9IHZhbHVlKTtcbiAgfVxuXG4gIC8vIGFjY2VzcyBsYXllcnNcbiAgZ2V0IGxheWVycygpIHtcbiAgICBsZXQgbGF5ZXJzID0gW107XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiBsYXllcnMgPSBsYXllcnMuY29uY2F0KHZpZXcubGF5ZXJzKSk7XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy5yZW5kZXIoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgncmVuZGVyJyk7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiB2aWV3LnVwZGF0ZSgpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGUnKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcudXBkYXRlQ29udGFpbmVyKCkpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3VwZGF0ZTpjb250YWluZXJzJyk7XG4gIH1cblxuICB1cGRhdGVMYXllcnMoKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiB2aWV3LnVwZGF0ZUxheWVycygpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6bGF5ZXJzJyk7XG4gIH1cbn0iXX0=