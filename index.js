
// combined accessors
var getSet = function getSet(obj){var props = arguments[1];if(props === void 0)props = null;

  if(!props) throw new Error('Property name is mandatory.');

  var add = function()  {var p = arguments[0];if(p === void 0)p = null;
    var _prop = '__' + p;
    if(!obj.hasOwnProperty(_prop)) obj[_prop] = null;
    
    obj[p] = function()  {var value = arguments[0];if(value === void 0)value = null;
      if (value === null) return obj[_prop];
      obj[_prop] = value;
      return obj;
    };
  };

  if (Array.isArray(props)) {
    props.forEach( function(p)  {return add(p)} );
  } else {
    add(props);
  }

};

var extend = function extend() {
  var args = Array.prototype.slice.call(arguments);
  var host = args.shift();
  var copy = args.shift();

  for (var i in copy) { host[i] = copy[i]; }
  args.unshift(host);

  if (args.length > 1) { return extend.apply(null, args); }
  return host;
};


module.exports = {
  extend: extend,
  getSet: getSet
};