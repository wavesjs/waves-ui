"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var Marker = _interopRequire(require("./marker"));

var AnnotatedMarker = (function (_Marker) {
  function AnnotatedMarker() {
    _classCallCheck(this, AnnotatedMarker);

    if (_Marker != null) {
      _Marker.apply(this, arguments);
    }
  }

  _inherits(AnnotatedMarker, _Marker);

  _createClass(AnnotatedMarker, {
    getClassName: {
      value: function getClassName() {
        return "annotated-marker";
      }
    },
    _getAccessorList: {
      value: function _getAccessorList() {
        var list = _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "_getAccessorList", this).call(this);
        list.text = "default";
        return list;
      }
    },
    render: {
      value: function render(renderingContext) {
        this.$el = _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "render", this).call(this, renderingContext);
        var height = renderingContext.height;

        this.$label = document.createElementNS(this.ns, "text");
        this.$label.setAttributeNS(null, "x", 10);
        this.$label.setAttributeNS(null, "y", 10);
        this.$label.setAttributeNS(null, "transform", "matrix(1, 0, 0, -1, 0, " + height + ")");
        this.$label.style.fontSize = "10px";
        this.$label.style.fontFamily = "monospace";
        this.$label.style.color = "#676767";
        this.$label.style.mozUserSelect = "none";
        this.$label.style.webkitUserSelect = "none";
        this.$label.style.userSelect = "none";

        this.$el.appendChild(this.$label);

        return this.$el;
      }
    },
    update: {
      value: function update(renderingContext, datum, index) {
        _get(_core.Object.getPrototypeOf(AnnotatedMarker.prototype), "update", this).call(this, renderingContext, datum, index);

        this.$label.innerHTML = this.text(datum);
      }
    }
  });

  return AnnotatedMarker;
})(Marker);

module.exports = AnnotatedMarker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBTyxNQUFNLDJCQUFNLFVBQVU7O0lBR1IsZUFBZTtXQUFmLGVBQWU7MEJBQWYsZUFBZTs7Ozs7OztZQUFmLGVBQWU7O2VBQWYsZUFBZTtBQUNsQyxnQkFBWTthQUFBLHdCQUFHO0FBQUUsZUFBTyxrQkFBa0IsQ0FBQztPQUFFOztBQUU3QyxvQkFBZ0I7YUFBQSw0QkFBRztBQUNqQixZQUFJLElBQUksb0NBSlMsZUFBZSxpREFJRyxDQUFDO0FBQ3BDLFlBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxHQUFHLG9DQVZTLGVBQWUsd0NBVVIsZ0JBQWdCLENBQUMsQ0FBQztBQUMxQyxZQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7O0FBRXZDLFlBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFlBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDMUMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyw4QkFBNEIsTUFBTSxPQUFJLENBQUM7QUFDbkYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUNwQyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7QUFDcEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUN6QyxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUM7QUFDNUMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQzs7QUFFdEMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVsQyxlQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7T0FDakI7O0FBRUQsVUFBTTthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckMseUNBOUJpQixlQUFlLHdDQThCbkIsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTs7QUFFN0MsWUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUMxQzs7OztTQWpDa0IsZUFBZTtHQUFTLE1BQU07O2lCQUE5QixlQUFlIiwiZmlsZSI6ImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWFya2VyIGZyb20gJy4vbWFya2VyJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbm5vdGF0ZWRNYXJrZXIgZXh0ZW5kcyBNYXJrZXIge1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnYW5ub3RhdGVkLW1hcmtlcic7IH1cblxuICBfZ2V0QWNjZXNzb3JMaXN0KCkge1xuICAgIGxldCBsaXN0ID0gc3VwZXIuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIGxpc3QudGV4dCA9ICdkZWZhdWx0JztcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7XG4gICAgdGhpcy4kZWwgPSBzdXBlci5yZW5kZXIocmVuZGVyaW5nQ29udGV4dCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gcmVuZGVyaW5nQ29udGV4dC5oZWlnaHQ7XG5cbiAgICB0aGlzLiRsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCAndGV4dCcpO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd4JywgMTApO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd5JywgMTApO1xuICAgIHRoaXMuJGxhYmVsLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCBgbWF0cml4KDEsIDAsIDAsIC0xLCAwLCAke2hlaWdodH0pYCk7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udFNpemUgPSAnMTBweCc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUuZm9udEZhbWlseSA9ICdtb25vc3BhY2UnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLmNvbG9yID0gJyM2NzY3NjcnO1xuICAgIHRoaXMuJGxhYmVsLnN0eWxlLm1velVzZXJTZWxlY3QgPSAnbm9uZSc7XG4gICAgdGhpcy4kbGFiZWwuc3R5bGUud2Via2l0VXNlclNlbGVjdCA9ICdub25lJztcbiAgICB0aGlzLiRsYWJlbC5zdHlsZS51c2VyU2VsZWN0ID0gJ25vbmUnO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kbGFiZWwpO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGRhdHVtLCBpbmRleCkge1xuICAgIHN1cGVyLnVwZGF0ZShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgaW5kZXgpO1xuXG4gICAgdGhpcy4kbGFiZWwuaW5uZXJIVE1MID0gdGhpcy50ZXh0KGRhdHVtKTtcbiAgfVxufVxuIl19