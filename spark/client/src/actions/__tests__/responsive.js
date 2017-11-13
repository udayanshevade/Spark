import * as actions from '../responsive';
import * as types from '../types';

describe('Responsive actions', () => {
  it('should have a type of WINDOW_RESIZE', () => {
    const width = 200;
    const height = 300;
    const expected = { type: types.WINDOW_RESIZE, width, height };
    expect(actions.responsiveResize({ width, height })).toEqual(expected);
  });
});