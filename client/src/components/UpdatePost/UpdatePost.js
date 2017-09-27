import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
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
import {
  FormTextInput,
  FormSelectInput,
  FormTextArea,
} from '../Forms';
import Loading from '../Loading';
import { validate, warn } from './validation';

class UpdatePost extends Component {
  state = {
    shouldRedirect: false,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isUpdating && nextProps.postData && !nextProps.isUpdating) {
      this.setState({ shouldRedirect: true });
    }
  }

  componentWillUnmount() {
    this.setState({ shouldRedirect: false });
    this.props.actions.postResetCreateData();
  }

  render() {
    if (this.state.shouldRedirect) {
      const { id, title } = this.props.postData;
      return <Redirect to={`/posts/thread/${id}/${title.toLowerCase().split(' ').join('-')}`} />
    }
    const {
      handleSubmit,
      updateSelectInput,
      onSubmit,
      isUpdating,
      actions,
      isMobile,
      navTitle,
      suggestions,
      heading,
    } = this.props;
    return isUpdating
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
            onSubmit={handleSubmit(onSubmit)}
            className="create-post-form"
          >
            <Header>
              <Heading className="new-post-create-title">{heading}</Heading>
            </Header>
            <FormFields>
              <Field
                name="title"
                label="Title"
                id="create-post-title"
                placeholder="Title of your post"
                component={FormTextInput}
              />
              <Field
                name="url"
                label="Link"
                id="create-post-url"
                placeholder="A link if you've got one"
                component={FormTextInput}
              />
              <Field
                name="body"
                label="Body"
                id="create-post-body"
                placeholder="Talk about the post here"
                component={FormTextArea}
              />
              <Field
                name="category"
                label="Category"
                id="create-post-category"
                onSearch={actions.postGetCategorySuggestions}
                onUpdateValue={(val) => {
                  updateSelectInput(val);
                  actions.postUpdateCreateData({ category: val });
                }}
                options={suggestions}
                help={<Anchor path="/categories/create">Or create one.</Anchor>}
                placeholder="Where to post, e.g. react"
                component={FormSelectInput}
              />
            </FormFields>
            <Footer pad={{ vertical: 'medium' }}>
              <Button
                plain
                label="submit"
                onClick={handleSubmit(onSubmit)}
              />
            </Footer>
          </Form>
        </Section>
      );
  }
}

UpdatePost.propTypes = {
  navTitle: PropTypes.string,
  onSubmit: PropTypes.func,
  actions: PropTypes.shape({
    postGetCategorySuggestions: PropTypes.func,
  }),
  isMobile: PropTypes.bool,
  suggestions: PropTypes.arrayOf(
    PropTypes.string
  ),
};

export default reduxForm({
  form: 'postCreateNew',
  validate,
  warn,
})(UpdatePost);
