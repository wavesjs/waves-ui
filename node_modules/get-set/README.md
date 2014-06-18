## AddgetterSetter

_A simple library for the lazy developper_

Adds getter/setters to a given object, the type of getter and setters added will be of jquery/d3 type:

``` js
var getSet = require('getSet');

var obj = {};

var addAcc = getSet(obj);
  addAcc('with');
  addAcc('height');
// or addAcc(['with', 'height'])  

obj.width(300);
obj.with(); // => 300

```

## API

The main exported function takes the object to augment, that will then return a function to add the specified accessors to the object. 

The lib will create non enumerable "private" underscored versions of your property, and the corresponding public getter/setter method.

## Using

You can use the provided getSet.min.js or browserify your own with grunt.
In order to use grunt, from the root of the module just do
```
npm install && grunt
```
This will install the dependencies and re-compile browserified and minified versions of the lib.
To run the tests just navigate to the `tests` subdirectory and run the `index.html` file.