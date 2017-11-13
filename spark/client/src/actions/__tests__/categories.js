import * as actions from '../categories';
import * as types from '../types';

describe('Categories actions', () => {
  it('should have a type of CATEGORIES_SET_LOADING', () => {
    const loading = false;
    const expected = { type: types.CATEGORIES_SET_LOADING, loading };
    expect(actions.categoriesSetLoading(loading)).toEqual(expected);
  });
  it('should have a type of CATEGORIES_UPDATE', () => {
    const categories = ['category', 'category'];
    const expected = { type: types.CATEGORIES_UPDATE, categories };
    expect(actions.categoriesUpdate(categories)).toEqual(expected);
  });
  it('should have a type of CATEGORIES_SET_ACTIVE', () => {
    const active = 'all';
    const expected = { type: types.CATEGORIES_SET_ACTIVE, active };
    expect(actions.categoriesSetActive(active)).toEqual(expected);
  });
});