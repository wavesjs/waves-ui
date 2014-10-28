
// combined accessors
var getSet = function getSet(obj, props = null){

  if (!props) throw new Error('Property name is mandatory.');

  var add = (p = null) => {
    var _prop = '__' + p;
    if (!obj.hasOwnProperty(_prop)) obj[_prop] = null;

    obj[p] = function(value = null) {
      if (value === null) return this[_prop];
      this[_prop] = value;
      return this;
    };
  };

  if (Array.isArray(props)) {
    props.forEach( (p) => add(p) );
  } else {
    add(props);
  }

};

// create a default data accessor for each given attrs
/*
var defaultDataMap = function defaultDataMap(obj, attrs) {
  attrs.forEach((attr) => {
    obj[attr]((d, v = null) => {
      if (v === null) return d.y;
      d[attr] = +v;
      return obj;
    })
  });
};
*/

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