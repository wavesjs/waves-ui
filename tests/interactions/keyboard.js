const test = require('tape');

import KeyBoard from '../../src/interactions/keyboard';


const body = window.document.body;

test('KeyBoard keydown', (assert) => {
    const keyboard = new KeyBoard(document);

    const keyboardEventInit = {
      'keyCode': 65,
      'shiftKey':true,
      'ctrlKey': true,
      'altKey': false,
      'metaKey': false
    };

    const keyDownEvent = new KeyboardEvent('keydown', keyboardEventInit);
    const keyUpEvent = new KeyboardEvent('keyup', keyboardEventInit);
    let i = 0;

    keyboard.on('event', (e) => {
      assert.equal(e.char, 'A');
      assert.equal(e.shiftKey, true);
      assert.equal(e.ctrlKey, true);
      assert.equal(e.altKey, false);
      assert.equal(e.metaKey, false);

      if (i === 0) {
        // First event is a keydown
        assert.equal(e.type, 'keydown');
        i++
      } else {
        // While second event is a keyup
        assert.equal(e.type, 'keyup');
        assert.end();
      }
    }, false)

    document.dispatchEvent(keyDownEvent);
    document.dispatchEvent(keyUpEvent);
})

