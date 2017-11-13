import * as actions from '../user';
import * as types from '../types';

describe('Navbar actions', () => {
  it('should have a type of USER_SET_LOGGED_IN', () => {
    const loggedIn = true;
    const expected = { type: types.USER_SET_LOGGED_IN, loggedIn };
    expect(actions.userSetLoggedIn(loggedIn)).toEqual(expected);
  });
  it('should have a type of USER_UPDATE_DATA', () => {
    const user = { someDetail: 'someValue' };
    const expected = { type: types.USER_UPDATE_DATA, user };
    expect(actions.userUpdateData(user)).toEqual(expected);
  });
});
