import * as types from './types';
import Requests from '../requests';

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
  const data = await Requests.get(`./thread/${postId}`);
  dispatch(postUpdateData(data));
};

export const postGetComments = postId => async(dispatch) => {
  const comments = await Requests.get(`./thread/${postId}/comments`);
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

export const postEmpty = () => ({
  type: types.POST_EMPTY,
});
