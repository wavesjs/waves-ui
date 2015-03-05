var EventEmitter = require("events").EventEmitter;

function observe(proto){
  let obj = new EventEmitter();

  function add(obj, prop, val = null) {
    var _prop = '_' + prop;
    if (!obj.hasOwnProperty(_prop)) obj[_prop] = val;

    Object.defineProperty(obj, prop, {
      get: function() { return this[_prop]; },
      set: function(v) {
        if(v !== this[`_${prop}`]){
          this.emit('change', {property:prop, oldValue: this[`_${prop}`], 'value':v});
          this[`_${prop}`] = v;
        }
      },
      enumerable: true,
      configurable: true
    });

  }

  for(var prop in proto) {
    add(obj, prop, proto[prop]);
  }

  return obj;
}

module.exports = observe;