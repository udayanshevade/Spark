import * as actions from '../navbar';
import * as types from '../types';

describe('Navbar actions', () => {
  it('should have a type of NAVBAR_TOGGLE_MENU', () => {
    const menuOpen = false;
    const expected = { type: types.NAVBAR_TOGGLE_MENU, menuOpen };
    expect(actions.navbarToggleMenu(menuOpen)).toEqual(expected);
  });
  it('should have a type of NAVBAR_SET_TITLE', () => {
    const title = 'title';
    const expected = { type: types.NAVBAR_SET_TITLE, title };
    expect(actions.navbarSetTitle(title)).toEqual(expected);
  });
});