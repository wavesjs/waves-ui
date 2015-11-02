'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseState = require('./base-state');

var _baseState2 = _interopRequireDefault(_baseState);

/**
 * A state to edit shapes in the more general way. Interact only with selected shapes.
 */

var EditionState = (function (_BaseState) {
  _inherits(EditionState, _BaseState);

  function EditionState(timeline) {
    _classCallCheck(this, EditionState);

    _get(Object.getPrototypeOf(EditionState.prototype), 'constructor', this).call(this, timeline);

    this.currentEditedLayer = null;
    this.currentTarget = null;
  }

  _createClass(EditionState, [{
    key: 'enter',
    value: function enter() {}
  }, {
    key: 'exit',
    value: function exit() {}
  }, {
    key: 'handleEvent',
    value: function handleEvent(e) {
      switch (e.type) {
        case 'mousedown':
          this.onMouseDown(e);
          break;
        case 'mousemove':
          this.onMouseMove(e);
          break;
        case 'mouseup':
          this.onMouseUp(e);
          break;
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      this.currentTarget = e.target;
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var _this = this;

      this.layers.forEach(function (layer) {
        var items = layer.selectedItems;

        layer.edit(items, e.dx, e.dy, _this.currentTarget);
        layer.update(items);
      });
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      this.currentEditedLayer = null;
      this.mouseDown = false;
    }
  }]);

  return EditionState;
})(_baseState2['default']);

exports['default'] = EditionState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdGF0ZXMvZWRpdGlvbi1zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFzQixjQUFjOzs7Ozs7OztJQU1mLFlBQVk7WUFBWixZQUFZOztBQUNwQixXQURRLFlBQVksQ0FDbkIsUUFBUSxFQUFFOzBCQURILFlBQVk7O0FBRTdCLCtCQUZpQixZQUFZLDZDQUV2QixRQUFRLEVBQUU7O0FBRWhCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7QUFDL0IsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7R0FDM0I7O2VBTmtCLFlBQVk7O1dBUTFCLGlCQUFHLEVBQUU7OztXQUNOLGdCQUFHLEVBQUU7OztXQUVFLHFCQUFDLENBQUMsRUFBRTtBQUNiLGNBQVEsQ0FBQyxDQUFDLElBQUk7QUFDWixhQUFLLFdBQVc7QUFDZCxjQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGdCQUFNO0FBQUEsQUFDUixhQUFLLFdBQVc7QUFDZCxjQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLGdCQUFNO0FBQUEsQUFDUixhQUFLLFNBQVM7QUFDWixjQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGdCQUFNO0FBQUEsT0FDVDtLQUNGOzs7V0FFVSxxQkFBQyxDQUFDLEVBQUU7QUFDYixVQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7S0FDL0I7OztXQUVVLHFCQUFDLENBQUMsRUFBRTs7O0FBQ2IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDN0IsWUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQzs7QUFFbEMsYUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQUssYUFBYSxDQUFDLENBQUM7QUFDbEQsYUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNyQixDQUFDLENBQUM7S0FDSjs7O1dBRVEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsVUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUMvQixVQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUN4Qjs7O1NBekNrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvc3RhdGVzL2VkaXRpb24tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVN0YXRlIGZyb20gJy4vYmFzZS1zdGF0ZSc7XG5cblxuLyoqXG4gKiBBIHN0YXRlIHRvIGVkaXQgc2hhcGVzIGluIHRoZSBtb3JlIGdlbmVyYWwgd2F5LiBJbnRlcmFjdCBvbmx5IHdpdGggc2VsZWN0ZWQgc2hhcGVzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0aW9uU3RhdGUgZXh0ZW5kcyBCYXNlU3RhdGUge1xuICBjb25zdHJ1Y3Rvcih0aW1lbGluZSkge1xuICAgIHN1cGVyKHRpbWVsaW5lKTtcblxuICAgIHRoaXMuY3VycmVudEVkaXRlZExheWVyID0gbnVsbDtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBudWxsO1xuICB9XG5cbiAgZW50ZXIoKSB7fVxuICBleGl0KCkge31cblxuICBoYW5kbGVFdmVudChlKSB7XG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdtb3VzZXVwJzpcbiAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBlLnRhcmdldDtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlKGUpIHtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgaXRlbXMgPSBsYXllci5zZWxlY3RlZEl0ZW1zO1xuXG4gICAgICBsYXllci5lZGl0KGl0ZW1zLCBlLmR4LCBlLmR5LCB0aGlzLmN1cnJlbnRUYXJnZXQpO1xuICAgICAgbGF5ZXIudXBkYXRlKGl0ZW1zKTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VVcChlKSB7XG4gICAgdGhpcy5jdXJyZW50RWRpdGVkTGF5ZXIgPSBudWxsO1xuICAgIHRoaXMubW91c2VEb3duID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==