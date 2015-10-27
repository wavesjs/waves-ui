const test = require('tape');

import Surface from '../../src/interactions/surface';


const body = window.document.body;

test('Surface, default instance attributes', (assert) => {
    const surface = new Surface(body);
    assert.equal(surface.mouseDownEvent, null);
    assert.equal(surface.lastEvent, null);
    assert.end();
})

test('Surface, trigger events', (assert) => {
    const surface = new Surface(body);

    // mousedown
    const mouseDownEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 10,
      clientY: 100
    });
    const clientRect = body.getBoundingClientRect();
    const top = clientRect.top;
    const left = clientRect.left;
    surface.once('event', (e) => {
        assert.equal(e.type, 'mousedown');
        assert.equal(surface.isMouseDown, true);
        assert.equal(e.x, 10 - left);
        assert.equal(e.y, 100 - top);

        // mousemove
        const mouseMoveEvent = new MouseEvent("mousemove", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: 100,
          clientY: 110
        });
        surface.once('event', (e) => {
            assert.equal(e.type, 'mousemove');
            assert.equal(surface.isMouseDown, true);

            // mouseup
            const mouseUpEvent = new MouseEvent("mouseup", {
              bubbles: true,
              cancelable: true,
              view: window,
              clientX: 110,
              clientY: 210
            });
            surface.once('event', (e) => {
                assert.equal(e.type, 'mouseup');
                assert.equal(surface.isMouseDown, false);
                assert.equal(surface.mouseDownEvent, null);
                assert.equal(surface.lastEvent, null);
                assert.end()
            })
            body.dispatchEvent(mouseUpEvent);
        })
        body.dispatchEvent(mouseMoveEvent);
    })
    body.dispatchEvent(mouseDownEvent);

    // click
    const click = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 10,
      clientY: 100
    });

    surface.once('event', (e) => {
      assert.equal(e.type, 'click');
    })

    body.dispatchEvent(click);

    // dblclick
    const dblclick = new MouseEvent("dblclick", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: 10,
      clientY: 100
    });

    surface.once('event', (e) => {
      assert.equal(e.type, 'dblclick');
    })

    body.dispatchEvent(dblclick);
})
