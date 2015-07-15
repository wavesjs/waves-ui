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
      // this should be able to modify the layers yScale to be really usefull

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3ZpZXctY29sbGVjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFHcUIsY0FBYztBQUN0QixXQURRLGNBQWMsQ0FDckIsUUFBUSxFQUFFOzBCQURILGNBQWM7O0FBRS9CLHFDQUZpQixjQUFjLDZDQUV2Qjs7QUFFUixRQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztHQUMzQjs7WUFMa0IsY0FBYzs7ZUFBZCxjQUFjO0FBTzdCLFVBQU07V0FBQSxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUs7U0FBQSxDQUFDLENBQUM7T0FDN0M7O0FBRUcsUUFBSTtXQUFBLFVBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7aUJBQUssSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLO1NBQUEsQ0FBQyxDQUFDO09BQzNDOztBQUVHLFNBQUs7V0FBQSxVQUFDLEtBQUssRUFBRTtBQUNmLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSztTQUFBLENBQUMsQ0FBQztPQUM1Qzs7QUFFRyxtQkFBZTtXQUFBLFVBQUMsS0FBSyxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2lCQUFLLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSztTQUFBLENBQUMsQ0FBQztPQUN0RDs7QUFFRywyQkFBdUI7V0FBQSxVQUFDLEtBQUssRUFBRTtBQUNqQyxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsS0FBSztTQUFBLENBQUMsQ0FBQztPQUM5RDs7QUFLRyxVQUFNOzs7Ozs7V0FBQSxVQUFDLEtBQUssRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUs7U0FBQSxDQUFDLENBQUM7T0FDN0M7O0FBRUQsVUFBTTthQUFBLGtCQUFHO0FBQ1AsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7aUJBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtTQUFBLENBQUMsQ0FBQztBQUN0QyxZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUMvQjs7QUFFRCxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQ3RDLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQy9COztBQUVELG1CQUFlO2FBQUEsMkJBQUc7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUk7aUJBQUssSUFBSSxDQUFDLGVBQWUsRUFBRTtTQUFBLENBQUMsQ0FBQztBQUMvQyxZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO09BQzFDOztBQUVELGdCQUFZO2FBQUEsd0JBQUc7QUFDYixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtpQkFBSyxJQUFJLENBQUMsWUFBWSxFQUFFO1NBQUEsQ0FBQyxDQUFDO0FBQzVDLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO09BQ3RDOzs7O1NBcERrQixjQUFjO0dBQVMsS0FBSzs7aUJBQTVCLGNBQWMiLCJmaWxlIjoiZXM2L2NvcmUvdmlldy1jb2xsZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgYFZpZXdDb2xsZWN0aW9uYCBjbGFzcyBhbGxvdyB0byB1cGRhdGUgYWxsIHRpbWVsaW5lJ3Mgdmlld3MgYXQgb25jZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3Q29sbGVjdGlvbiBleHRlbmRzIEFycmF5IHtcbiAgY29uc3RydWN0b3IodGltZWxpbmUpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fdGltZWxpbmUgPSB0aW1lbGluZTtcbiAgfVxuXG4gIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcub2Zmc2V0ID0gdmFsdWUpO1xuICB9XG5cbiAgc2V0IHpvb20odmFsdWUpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcuem9vbSA9IHZhbHVlKTtcbiAgfVxuXG4gIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy53aWR0aCA9IHZhbHVlKTtcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcucGl4ZWxzUGVyU2Vjb25kID0gdmFsdWUpO1xuICB9XG5cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiB2aWV3Lm1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gdmFsdWUpO1xuICB9XG5cbiAgLy8gQE5PVEUga2VlcCB0aGlzID9cbiAgLy8gY291bGQgcHJlcGFyZSBzb21lIHZlcnRpY2FsIHJlc2l6aW5nIGFiaWxpdHlcbiAgLy8gdGhpcyBzaG91bGQgYmUgYWJsZSB0byBtb2RpZnkgdGhlIGxheWVycyB5U2NhbGUgdG8gYmUgcmVhbGx5IHVzZWZ1bGxcbiAgc2V0IGhlaWdodCh2YWx1ZSkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy5oZWlnaHQgPSB2YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5mb3JFYWNoKCh2aWV3KSA9PiB2aWV3LnJlbmRlcigpKTtcbiAgICB0aGlzLl90aW1lbGluZS5lbWl0KCdyZW5kZXInKTtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcudXBkYXRlKCkpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3VwZGF0ZScpO1xuICB9XG5cbiAgdXBkYXRlQ29udGFpbmVyKCkge1xuICAgIHRoaXMuZm9yRWFjaCgodmlldykgPT4gdmlldy51cGRhdGVDb250YWluZXIoKSk7XG4gICAgdGhpcy5fdGltZWxpbmUuZW1pdCgndXBkYXRlOmNvbnRhaW5lcnMnKTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVycygpIHtcbiAgICB0aGlzLmZvckVhY2goKHZpZXcpID0+IHZpZXcudXBkYXRlTGF5ZXJzKCkpO1xuICAgIHRoaXMuX3RpbWVsaW5lLmVtaXQoJ3VwZGF0ZTpsYXllcnMnKTtcbiAgfVxufSJdfQ==