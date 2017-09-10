import * as types from './types';
import Requests from '../requests';

const postsURL = './posts/';

export const postsQueryUpdate = query => ({
  type: types.POSTS_QUERY_UPDATE,
  query,
});

export const postsSetLoading = loading => ({
  type: types.POSTS_SET_LOADING,
  loading,
});

export const postsUpdate = posts => ({
  type: types.POSTS_UPDATE,
  posts,
});

export const postsLoadData = query => async(dispatch) => {
  dispatch(postsSetLoading(true));
  const posts = await Requests.get(`${postsURL}${query}`);
  dispatch(postsSetLoading(false));
  dispatch(postsUpdate(posts));
};
