"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Layer = _interopRequire(require("../core/layer"));

var Cursor = _interopRequire(require("../shapes/cursor"));

var CursorLayer = (function (_Layer) {
  function CursorLayer() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, CursorLayer);

    var data = { currentPosition: 0 };

    _get(_core.Object.getPrototypeOf(CursorLayer.prototype), "constructor", this).call(this, "entity", data, options);

    this.configureShape(Cursor, { x: function (d) {
        return d.currentPosition;
      } }, {
      color: options.color
    });
  }

  _inherits(CursorLayer, _Layer);

  _createClass(CursorLayer, {
    currentPosition: {
      set: function (value) {
        this.data.currentPosition = value;
      },
      get: function () {
        return this.data.currentPosition;
      }
    }
  });

  return CursorLayer;
})(Layer);

module.exports = CursorLayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL2N1cnNvci1sYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUFPLEtBQUssMkJBQU0sZUFBZTs7SUFDMUIsTUFBTSwyQkFBTSxrQkFBa0I7O0lBR2hCLFdBQVc7QUFDbkIsV0FEUSxXQUFXLEdBQ0o7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURMLFdBQVc7O0FBRTVCLFFBQU0sSUFBSSxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUMsRUFBRSxDQUFDOztBQUVwQyxxQ0FKaUIsV0FBVyw2Q0FJdEIsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7O0FBRS9CLFFBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFVBQUMsQ0FBQztlQUFLLENBQUMsQ0FBQyxlQUFlO09BQUEsRUFBRSxFQUFFO0FBQzNELFdBQUssRUFBRSxPQUFPLENBQUMsS0FBSztLQUNyQixDQUFDLENBQUM7R0FDSjs7WUFUa0IsV0FBVzs7ZUFBWCxXQUFXO0FBZTFCLG1CQUFlO1dBSkEsVUFBQyxLQUFLLEVBQUU7QUFDekIsWUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO09BQ25DO1dBRWtCLFlBQUc7QUFDcEIsZUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztPQUNsQzs7OztTQWpCa0IsV0FBVztHQUFTLEtBQUs7O2lCQUF6QixXQUFXIiwiZmlsZSI6ImVzNi9oZWxwZXJzL2N1cnNvci1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMYXllciBmcm9tICcuLi9jb3JlL2xheWVyJztcbmltcG9ydCBDdXJzb3IgZnJvbSAnLi4vc2hhcGVzL2N1cnNvcic7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3Vyc29yTGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRhdGEgPSB7IGN1cnJlbnRQb3NpdGlvbjogMCB9O1xuXG4gICAgc3VwZXIoJ2VudGl0eScsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb25maWd1cmVTaGFwZShDdXJzb3IsIHsgeDogKGQpID0+IGQuY3VycmVudFBvc2l0aW9uIH0sIHtcbiAgICAgIGNvbG9yOiBvcHRpb25zLmNvbG9yXG4gICAgfSk7XG4gIH1cblxuICBzZXQgY3VycmVudFBvc2l0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5kYXRhLmN1cnJlbnRQb3NpdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRQb3NpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhLmN1cnJlbnRQb3NpdGlvbjtcbiAgfVxufVxuIl19