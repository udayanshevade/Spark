import reducer, { initialState } from '../categories';
import * as types from '../../actions/types';

describe('Categories reducer', () => {
  it('should first return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });
  it('should handle state for type CATEGORIES_SET_LOADING', () => {
    const loading = true;
    const before = { loading: false };
    const after = { loading };
    const action = { type: types.CATEGORIES_SET_LOADING, loading };
    expect(reducer(before, action)).toEqual(after);
  });
  it('should handle state for type CATEGORIES_UPDATE', () => {
    const categories = ['category', 'category'];
    const before = { categories: [] };
    const after = { categories };
    const action = { type: types.CATEGORIES_UPDATE, categories };
    expect(reducer(before, action)).toEqual(after);
  });
  it('should handle state for type CATEGORIES_SET_ACTIVE', () => {
    const active = 'category';
    const before = { active: '' };
    const after = { active };
    const action = { type: types.CATEGORIES_SET_ACTIVE, active };
    expect(reducer(before, action)).toEqual(after);
  });
});