import reducer, { initialState } from '../user';
import * as types from '../../actions/types';

describe('User reducer', () => {
  it('should first return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it('should handle state for type USER_SET_LOGGED_IN', () => {
    const loggedIn = true;
    const before = { loggedIn: false };
    const after = { loggedIn };
    const action = { type: types.USER_SET_LOGGED_IN, loggedIn };
    expect(reducer(before, action)).toEqual(after);
  });
  it('should handle state for type USER_UPDATE_DATA', () => {
    const user = { 'someDetail': 'someValue' };
    const before = { user: null };
    const after = { user };
    const action = { type: types.USER_UPDATE_DATA, user };
    expect(reducer(before, action)).toEqual(after);
  });
});