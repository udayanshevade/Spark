import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Section from 'grommet/components/Section';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import ListPlaceHolder from 'grommet-addons/components/ListPlaceholder';
import Comments from './Comments';
import FilterBar from '../FilterBar';
import Loading from '../Loading';
import { userRecordVote } from '../../actions/user';
import {
  postSelectSortCriterion,
  postGetComments,
  postUpdateComments,
} from '../../actions/post';
import { commentDelete } from '../../actions/comment';
import { profileSetUser } from '../../actions/profile';
import { getStructuredComments } from '../../selectors/post';
import { getUsername, getUserVotesGiven } from '../../selectors/user';

export const CommentsContainer = ({
  postId,
  width,
  loading,
  depleted,
  comments,
  actions,
  votesGiven,
  username,
  threadView,
  commentView,
  ...filterProps,
}) => {
  let commentsEl;
  if (loading && !comments.length) {
    commentsEl = (
      <Loading />
    );
  } else if (!comments.length) {
    commentsEl = (
      <ListPlaceHolder
        emptyMessage="No comments yet."
        filteredTotal={comments.length}
        unfilteredTotal={comments.length}
      />
    );
  } else {
    commentsEl = (
      <Section pad={{ vertical: 'medium' }} className="comments-section">
        {
          !commentView &&
            <FilterBar
              width={width}
              {...filterProps}
              selectSortCriterion={actions.postSelectSortCriterion}
            />
        }
        <Comments
          width={width}
          comments={comments}
          profileSetUser={actions.profileSetUser}
          applyVote={(id, vote) => {
            actions.userRecordVote('comments', id, vote);
          }}
          showChildren
          votesGiven={votesGiven}
          username={username}
          threadView={threadView}
          commentView={commentView}
          commentDelete={actions.commentDelete}
        />
        {
          !(depleted || loading) &&
            <Footer justify="center">
              <Button
                plain
                label={!commentView ? 'Load more' : null}
                path={commentView ? `/posts/thread/${postId}/` : null}
                onClick={!commentView
                  ? () => {
                    actions.postGetComments(postId);
                  }
                  : null
                }
              />
            </Footer>
        }
      </Section>
    );
  }
  return commentsEl;
}

CommentsContainer.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    })
  ),
  actions: PropTypes.shape({
    profileSetUser: PropTypes.func,
  }),
  width: PropTypes.number,
  username: PropTypes.string,
};

const mapStateToProps = ({ user, post, responsive }, { commentId }) => ({
  postId: post.data.id,
  loading: post.loading,
  depleted: post.comments.depleted,
  comments: getStructuredComments(post, commentId),
  sortCriteria: post.comments.criteria,
  sortDirection: post.comments.sortDirection,
  selectedCriterion: post.comments.selectedCriterion,
  width: responsive.width,
  votesGiven: getUserVotesGiven(user),
  username: getUsername(user),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postSelectSortCriterion,
    postGetComments,
    postUpdateComments,
    profileSetUser,
    userRecordVote,
    commentDelete,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsContainer);
