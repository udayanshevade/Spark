import * as types from './types';
import Requests from '../requests';
import { appShowTipWithText } from './app';
import { userUpdateVotes, userAddPost } from './user';

const APIbaseURL = '/posts';
const categoriesURL = '/categories';

export const postSetLoading = loading => ({
  type: types.POST_SET_LOADING,
  loading,
});

export const postUpdateData = data => ({
  type: types.POST_UPDATE_DATA,
  data,
});

export const postUpdateComments = comments => ({
  type: types.POST_UPDATE_COMMENTS,
  comments,
});

export const postGetData = postId => async(dispatch) => {
  const data = await Requests.get(`${APIbaseURL}/thread/${postId}`);
  dispatch(postUpdateData(data));
};

export const postGetComments = postId => async(dispatch) => {
  const comments = await Requests.get(`${APIbaseURL}/thread/${postId}/comments`);
  dispatch(postUpdateComments(comments));
  dispatch(postSetLoading(false));
};

export const postGetDetails = postId => async(dispatch) => {
  dispatch(postSetLoading(true));
  dispatch(postGetData(postId));
  dispatch(postGetComments(postId));
};

export const postUpdateSortCriterion = selectedCriterion => ({
  type: types.POST_COMMENTS_UPDATE_SORT_CRITERION,
  selectedCriterion,
});

export const postUpdateSortDirection = sortDirection => ({
  type: types.POST_COMMENTS_UPDATE_SORT_DIRECTION,
  sortDirection,
});

export const postSelectSortCriterion = ({ value, direction }) => (dispatch, getState) => {
  const { post } = getState();
  const { selectedCriterion, sortDirection } = post;
  if (selectedCriterion !== value) {
    dispatch(postUpdateSortCriterion(value));
  }
  if (sortDirection !== direction) {
    dispatch(postUpdateSortDirection(direction));
  }
};

export const postToggleShowFull = () => ({
  type: types.POST_TOGGLE_SHOW_FULL,
});

export const postEmpty = () => ({
  type: types.POST_EMPTY,
});

export const postSetCreating = creating => ({
  type: types.POST_SET_CREATING,
  creating,
});

export const postCreateNew = rawData => async(dispatch, getState) => {
  dispatch(postUpdateData(null));
  const { user } = getState();
  if (!user.user) {
    appShowTipWithText('Login to submit a new post.', 'footer-login-button');
    return;
  }
  const { sessionToken, profile } = user.user;
  dispatch(postSetCreating(true));
  const postData = {
    ...rawData,
    author: profile.id,
  };
  const data = await Requests.post({
    url: APIbaseURL,
    headers: { sessionToken },
    body: { ...postData },
  });
  if (!data.error) {
    dispatch(postUpdateData(data));
    dispatch(userUpdateVotes(data.id, 'upVote', null, 'posts'));
    dispatch(userAddPost(data.id));
  }
  dispatch(postSetCreating(false));
};

export const postUpdateCategorySuggestions = results => ({
  type: types.POST_UPDATE_CATEGORY_SUGGESTIONS,
  results,
});

export const postLoadCategorySuggestions = query => async(dispatch) => {
  const suggestions = await Requests.get(`${categoriesURL}/suggestions/${query}/suggestions`);
  dispatch(postUpdateCategorySuggestions(suggestions));
};

export const postGetCategorySuggestions = (e) => async(dispatch, getState) => {
  const query = e.target.value;
  const { post } = getState();
  const { categorySuggestions } = post;
  const { timeoutId, timeoutLength } = categorySuggestions;
  // clear prior timeout if still typing
  clearTimeout(timeoutId);
  const newTimeoutId = setTimeout(() => {
    // load appropriate data
    dispatch(postLoadCategorySuggestions(query));
  }, timeoutLength);
  dispatch(postCategorySuggestionsSetTimeout(newTimeoutId));
};

export const postCategorySuggestionsSetTimeout = timeoutId => ({
  type: types.POST_CATEGORIES_SET_TIMEOUT,
  timeoutId,
});
