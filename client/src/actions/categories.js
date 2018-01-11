import { change, reset, SubmissionError } from 'redux-form';
import * as types from './types';
import { appShowTipWithText } from './app';
import { postSetCreating } from './post';
import { postsLoadData } from './posts';
import { userUpdateData } from './user';
import Requests from '../requests';

const categoriesURL = '/categories';

export const categoriesQueryUpdate = query => ({
  type: types.CATEGORIES_QUERY_UPDATE,
  query,
});

export const categoriesSetLoading = loading => ({
  type: types.CATEGORIES_SET_LOADING,
  loading,
});

export const categoriesSetIsCreating = isCreating => ({
  type: types.CATEGORIES_SET_IS_CREATING,
  isCreating,
});

export const categoriesUpdate = categories => ({
  type: types.CATEGORIES_UPDATE,
  categories,
});

export const categoriesUpdateOffset = offset => ({
  type: types.CATEGORIES_UPDATE_OFFSET,
  offset,
});

export const categoriesUpdateDepleted = depleted => ({
  type: types.CATEGORIES_UPDATE_DEPLETED,
  depleted,
});

export const categoriesLoadData = (query = '') => async(dispatch, getState) => {
  const { offset } = getState().categories;
  dispatch(categoriesSetLoading(true));
  const url = `${categoriesURL}/get/${query}`;
  const headers = { offset };
  const { categories, depleted } = await Requests.get({ url, headers });
  dispatch(categoriesSetLoading(false));
  dispatch(categoriesUpdate(categories));
  dispatch(categoriesUpdateDepleted(depleted));
  dispatch(categoriesUpdateOffset(offset + categories.length));
};

export const categoriesSetActive = active => ({
  type: types.CATEGORIES_SET_ACTIVE,
  active,
});

export const categoriesUpdateSuggestions = results => ({
  type: types.CATEGORIES_UPDATE_SUGGESTIONS,
  results,
});

export const categoriesSetSuggestionsLoading = loading => ({
  type: types.CATEGORIES_SUGGESTIONS_SET_LOADING,
  loading,
});

export const categoriesLoadSuggestions = query => async(dispatch) => {
  const url = `${categoriesURL}/suggestions/${query}`;
  const suggestions = await Requests.get({ url });
  dispatch(categoriesUpdateSuggestions(suggestions));
  return suggestions;
};

export const categoriesUpdateSuggestionsQuery = query => ({
  type: types.CATEGORIES_UPDATE_SUGGESTIONS_QUERY,
  query,
});

export const categoriesGetSuggestions = query => async(dispatch, getState) => {
  const { categories } = getState();
  const { categorySuggestions } = categories;
  const { timeoutId, timeoutLength } = categorySuggestions;
  // clear prior timeout if still typing
  clearTimeout(timeoutId);
  const newTimeoutId = setTimeout(async() => {
    dispatch(categoriesSetSuggestionsLoading(true));
    // load appropriate data
    const suggestions = await dispatch(categoriesLoadSuggestions(query));
    dispatch(categoriesUpdateSuggestionsQuery(query));
    dispatch(categoriesUpdateSuggestions(suggestions));
    dispatch(categoriesSetSuggestionsLoading(false));
  }, timeoutLength);
  dispatch(categoriesSetSuggestionsSetTimeout(newTimeoutId));
};

export const categoriesSetSuggestionsSetTimeout = timeoutId => ({
  type: types.CATEGORIES_SUGGESTIONS_SET_TIMEOUT,
  timeoutId,
});

export const categoriesSetSubmitStatus = submitStatus => ({
  type: types.CATEGORIES_SET_SUBMIT_STATUS,
  submitStatus,
});

export const categoriesCreateNew = data => async(dispatch, getState) => {
  const { user, categories: { categories, categorySuggestions }, post } = getState();
  if (!user.user) {
    dispatch(appShowTipWithText('Login to create a category', 'footer-login-button'));
    return;
  }
  const { subscriptions, sessionToken, profile } = user.user;
  const { id } = profile;
  const url = `${categoriesURL}/create`;
  // pre-emptive check to see if category exists,
  // prevents additional roundtrip
  if (data.name === categorySuggestions.results[0]) {
    console.log('Category already exists');
    throw new SubmissionError({ name: 'Category exists' });
  }
  dispatch(categoriesSetIsCreating(true));
  const res = await Requests.post({
    url,
    headers: { sessionToken },
    body: { user: id, ...data },
  });
  if (res.success) {
    const newCategories = [...categories];
    newCategories.unshift({
      ...data,
      path: data.name,
      posts: [],
    });
    const newSubscriptions = [...subscriptions];
    newSubscriptions.unshift(data.name);
    dispatch(categoriesSetActive(data.name));
    dispatch(categoriesUpdate(newCategories));
    dispatch(userUpdateData({ ...user.user, subscriptions: newSubscriptions }));
    dispatch(categoriesSetSubmitStatus('success'));
    dispatch(categoriesSetIsCreating(false));
    if (post.creating) {
      dispatch(postSetCreating(false));
      dispatch(change('postCreateNew', 'category', data.name));
      dispatch(reset('categoryCreateNew'));
    }
  } else if (res.error) {
    throw new SubmissionError({ name: res.error });
  }
};

const categoriesGetCategoryData = async(category) => {
  const url = `${categoriesURL}/category/${category}`;
  const res = await Requests.get({ url });
  if (!res.error) {
    return res;
  }
};

export const categoriesLoadCategoryData = category => async(dispatch, getState) => {
  const { categories: { categories } } = getState();
  dispatch(postsLoadData('', category));
  const freshCategories = [...categories];
  const oldIndex = freshCategories.findIndex(cat => cat.name === category);
  const res = await categoriesGetCategoryData(category);
  if (res && !res.error) {
    freshCategories.splice(oldIndex, 1, res);
  }
  dispatch(categoriesUpdate(freshCategories));
};

export const categoriesToggleBlurbExpanded = blurbExpanded => ({
  type: types.CATEGORIES_TOGGLE_BLURB_EXPANDED,
  blurbExpanded,
});

export const categoriesUpdateSubscribers = (category, option) => (dispatch, getState) => {
  const { categories: { categories } } = getState();
  const newCategories = [...categories];
  const index = newCategories.findIndex(cat => cat.name === category);
  let updateBy;
  switch (option) {
    case 'subscribe': {
      updateBy = 1;
      break;
    }
    case 'unsubscribe': {
      updateBy = -1;
      break;
    }
    default: {
      updateBy = 0;
    }
  }
  const oldCategory = categories[index];
  const updatedCategory = {
    ...oldCategory,
    subscribers: +oldCategory.subscribers + updateBy,
  };
  newCategories.splice(index, 1, updatedCategory);
  dispatch(categoriesUpdate(newCategories));
};

export const categoriesResetCreateData = () => ({
  type: types.CATEGORIES_RESET_CREATE_DATA,
});
