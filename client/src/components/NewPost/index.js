import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, change as changeFieldValue } from 'redux-form';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Section from 'grommet/components/Section';
import Form from 'grommet/components/Form';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import NewPostInput from './NewPostInput';
import NewPostTextArea from './NewPostTextArea';
import NewPostSelect from './NewPostSelect';
import Loading from '../Loading';
import {
  postCreateNew,
  postGetCategorySuggestions,
  postUpdateCreateCategory,
} from '../../actions/post';
import { getIsMobile } from '../../selectors/responsive';
import { validate, warn } from './validation';

class NewPost extends Component {
  state = {
    shouldRedirect: false,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isCreating && nextProps.postData && !nextProps.isCreating) {
      this.setState({ shouldRedirect: true });
    }
  }

  componentWillUnmount() {
    this.setState({ shouldRedirect: false });
  }

  render() {
    if (this.state.shouldRedirect) {
      const { id, title } = this.props.postData;
      return <Redirect to={`/posts/thread/${id}/${title.toLowerCase().split(' ').join('-')}`} />
    }
    const {
      handleSubmit,
      isCreating,
      actions,
      isMobile,
      navTitle,
      categorySuggestions: {
        results: categorySuggestions,
      },
    } = this.props;
    return isCreating
      ? <Loading />
      : (
        <Section pad="none" className="main-container">
          <Header
            size="small"
            pad={{ horizontal: 'small' }}
            className="main-header"
          >
            <Title className="app-header__title" responsive={false}>
              <Anchor path="/"><span>{navTitle}</span></Anchor>
            </Title>
          </Header>
          <Form
            compact={isMobile}
            onSubmit={handleSubmit(actions.postCreateNew)}
            className="create-post-form"
          >
            <Header>
              <Heading className="new-post-create-title">new post</Heading>
            </Header>
            <FormFields>
              <Field
                name="title"
                label="Title"
                id="create-post-title"
                placeholder="Title of your post"
                component={NewPostInput}
              />
              <Field
                name="link"
                label="Link"
                id="create-post-link"
                placeholder="A link if you've got one"
                component={NewPostInput}
              />
              <Field
                name="body"
                label="Body"
                id="create-post-body"
                placeholder="Talk about the post here"
                component={NewPostTextArea}
              />
              <Field
                name="category"
                label="Category"
                id="create-post-category"
                onSearch={actions.postGetCategorySuggestions}
                updateSelectInput={(val) => {
                  actions.postUpdateCategoryValue('postCreateNew', 'category', val);
                }}
                options={categorySuggestions}
                help={<Anchor path="/categories/create">Or create one.</Anchor>}
                placeholder="Where to post, e.g. react"
                updateCategory={actions.postUpdateCreateCategory}
                component={NewPostSelect}
              />
            </FormFields>
            <Footer pad={{ vertical: 'medium' }}>
              <Button
                plain
                label="submit"
                onClick={handleSubmit(actions.postCreateNew)}
              />
            </Footer>
          </Form>
        </Section>
      );
  }
}

NewPost.propTypes = {
  navTitle: PropTypes.string,
  handleSubmit: PropTypes.func,
  actions: PropTypes.shape({
    postCreateNew: PropTypes.func,
  }),
  isMobile: PropTypes.bool,
  categorySuggestions: PropTypes.shape({
    results: PropTypes.arrayOf(
      PropTypes.string
    ),
  }),
};

const mapStateToProps = ({ post, navbar, responsive }) => ({
  postData: post.data,
  initialValues: post.createData,
  categorySuggestions: post.categorySuggestions,
  isCreating: post.creating,
  navTitle: navbar.title,
  isMobile: getIsMobile(responsive),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postCreateNew,
    postGetCategorySuggestions,
    postUpdateCreateCategory,
    postUpdateCategoryValue: changeFieldValue,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'postCreateNew',
    validate,
    warn,
  })(NewPost)
);
