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
    height: {

      // @NOTE keep this ?
      // could prepare some vertical resizing ability
      // this should be able to modify the layers yScale to be really usefull

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RyYWNrLWNvbGxlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0lBR3FCLGNBQWM7QUFDdEIsV0FEUSxjQUFjLENBQ3JCLFFBQVEsRUFBRTswQkFESCxjQUFjOztBQUUvQixxQ0FGaUIsY0FBYyw2Q0FFdkI7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7R0FDM0I7O1lBTGtCLGNBQWM7O2VBQWQsY0FBYztBQVc3QixVQUFNOzs7Ozs7V0FBQSxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUs7U0FBQSxDQUFDLENBQUM7T0FDN0M7O0FBR0csVUFBTTs7OztXQUFBLFlBQUc7QUFDWCxZQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7aUJBQUssTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUFBLENBQUMsQ0FBQzs7QUFFNUQsZUFBTyxNQUFNLENBQUM7T0FDZjs7QUFFRCxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQ3RDLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQy9COztBQUVELFVBQU07YUFBQSxrQkFBRztBQUNQLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7U0FBQSxDQUFDLENBQUM7QUFDdEMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDL0I7O0FBRUQsbUJBQWU7YUFBQSwyQkFBRztBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsZUFBZSxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7T0FDMUM7O0FBRUQsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxZQUFZLEVBQUU7U0FBQSxDQUFDLENBQUM7QUFDNUMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7T0FDdEM7Ozs7U0F6Q2tCLGNBQWM7R0FBUyxLQUFLOztpQkFBNUIsY0FBYyIsImZpbGUiOiJlczYvY29yZS90cmFjay1jb2xsZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgYFZpZXdDb2xsZWN0aW9uYCBjbGFzcyBhbGxvdyB0byB1cGRhdGUgYWxsIHRpbWVsaW5lJ3Mgdmlld3MgYXQgb25jZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3Q29sbGVjdGlvbiBleHRlbmRzIEFycmF5IHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fdGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIC8vIEBOT1RFIGtlZXAgdGhpcyA/XG4gIC8vIGNvdWxkIHByZXBhcmUgc29tZSB2ZXJ0aWNhbCByZXNpemluZyBhYmlsaXR5XG4gIC8vIHRoaXMgc2hvdWxkIGJlIGFibGUgdG8gbW9kaWZ5IHRoZSBsYXllcnMgeVNjYWxlIHRvIGJlIHJlYWxseSB1c2VmdWxsXG5cbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy5oZWlnaHQgPSB2YWx1ZSk7XG4gIH1cblxuICAvLyBhY2Nlc3MgbGF5ZXJzXG4gIGdldCBsYXllcnMoKSB7XG4gICAgbGV0IGxheWVycyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gbGF5ZXJzID0gbGF5ZXJzLmNvbmNhdCh2aWV3LmxheWVycykpO1xuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcucmVuZGVyKCkpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3JlbmRlcicpO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy51cGRhdGUoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlJyk7XG4gIH1cblxuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiB2aWV3LnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCd1cGRhdGU6Y29udGFpbmVycycpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy51cGRhdGVMYXllcnMoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmxheWVycycpO1xuICB9XG59Il19