import reducer, { initialState } from '../navbar';
import * as types from '../../actions/types';

describe('Navbar reducer', () => {
  it('should first return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it('should handle state for type NAVBAR_TOGGLE_MENU', () => {
    const menuOpen = true;
    const before = { menuOpen: false };
    const after = { menuOpen };
    const action = { type: types.NAVBAR_TOGGLE_MENU, menuOpen };
    expect(reducer(before, action)).toEqual(after);
  });
  it('should handle state for type NAVBAR_SET_TITLE', () => {
    const title = 'Title';
    const before = { title: '' };
    const after = { title };
    const action = { type: types.NAVBAR_SET_TITLE, title };
    expect(reducer(before, action)).toEqual(after);
  });
});