import reducer, { initialState } from '../responsive';
import * as types from '../../actions/types';

describe('Responsive reducer', () => {
  it('should first return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it('should handle state for type WINDOW_RESIZE', () => {
    const width = 300;
    const height = 500;
    const before = { width: 200, height: 400 };
    const after = { width, height };
    const action = { type: types.WINDOW_RESIZE, width, height };
    expect(reducer(before, action)).toEqual(after);
  });
});