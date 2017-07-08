const test = require('tape');

import OrthogonalData from '../../src/utils/orthogonal-data';


test('OrthogonalData', (assert) => {
    const od1 = new OrthogonalData();
    const a1 = [1, 2, 3];
    const a2 = [4, 5, 6];
    const obj = {a1, a2};
    od1.cols = obj;
    assert.deepEqual(od1.rows, [ { a1: 1, a2: 4 }, { a1: 2, a2: 5 }, { a1: 3, a2: 6 }], "Correctly tranforms cols to rows")

    const od2 = new OrthogonalData();
    od2.rows = [ { a1: 1, a2: 4 }, { a1: 2, a2: 5 }, { a1: 3, a2: 6 } ]
    assert.deepEqual(od2.cols, {a1, a2}, "Correctly tranforms rows to cols");
    assert.end()
})
