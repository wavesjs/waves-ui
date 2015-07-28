const test = require('tape');

import Track from '../../es6/core/track';

test('Track - instanciation', (assert) => {
  const trackDiv = document.createElement("div");
  document.body.appendChild(trackDiv);
  const track = new Track(trackDiv);
  assert.equal(track.height, 100, "Default height is 100");
  track.height = 200;
  assert.equal(track.height, 200, "When set to 200, height is 200px");
  assert.equal(track.$el.innerHTML,'<svg class="track" xmlns:xhtml="http://www.w3.org/1999/xhtml" height="100" shape-rendering="optimizeSpeed"><defs></defs><rect style="fill-opacity:0" width="100%" height="100%"></rect><g class="offset"><g class="layout"></g></g><g class="interactions"></g></svg>');
  assert.end();
});
