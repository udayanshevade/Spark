import * as types from './types';
import Requests from '../requests';

const postsURL = './posts';
const categoryURL = '/categories';

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

export const postsUpdateOffset = offset => ({
  type: types.POSTS_UPDATE_OFFSET,
  offset,
});

export const postsUpdateDepleted = depleted => ({
  type: types.POSTS_UPDATE_DEPLETED,
  depleted,
});

export const postsLoadData = (query = '', category) => async(dispatch, getState) => {
  const { search, posts } = getState();
  const { selectedCriterion: criterion, sortDirection: direction } = search;
  const { offset, limit, posts: oldPosts } = posts;
  const headers = { criterion, offset, limit, direction };
  const url = category
    ? `${categoryURL}/category/${category}/posts/${query}`
    : `${postsURL}/get/${query}`;
  dispatch(postsSetLoading(true));
  const res = await Requests.get({ url, headers });
  if (!res.error) {
    dispatch(postsUpdateDepleted(res.depleted));
    let morePosts = [...res.posts];
    if (offset) {
      morePosts = [...oldPosts, ...morePosts];
    }
    dispatch(postsUpdate(morePosts));
    dispatch(postsUpdateOffset(offset + limit));
  }
  dispatch(postsSetLoading(false));
};
