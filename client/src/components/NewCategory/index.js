import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  change as changeFormValue,
} from 'redux-form';
import { Redirect } from 'react-router-dom';
import Section from 'grommet/components/Section';
import Form from 'grommet/components/Form';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Anchor from 'grommet/components/Anchor';
import Heading from 'grommet/components/Heading';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import Suggestions from './Suggestions';
import { FormTextInput, FormTextArea/*, FormCheckBox*/ } from '../Forms';
import Loading from '../Loading';
import { validate, warn } from './validation';
import {
  categoriesResetCreateData,
  categoriesCreateNew,
  categoriesGetSuggestions,
  categoriesSetActive,
  categoriesSetSubmitStatus,
} from '../../actions/categories';
import { postSetCreating } from '../../actions/post';
import { getIsMobile } from '../../selectors/responsive';

class NewCategory extends Component {
  componentWillUnmount() {
    this.props.actions.categoriesSetActive('');
    this.props.actions.categoriesResetCreateData();
    if (this.props.postUpdating) {
      this.props.actions.postSetCreating(false);
    }
    if (this.props.submitStatus === 'success') {
      this.props.actions.categoriesSetSubmitStatus('pending');
    }
  }
  render() {
    if (this.props.submitStatus === 'success') {
      let el;
      if (this.props.postUpdating) {
        el = <Redirect to="/posts/new" />;
      } else {
        el = <Redirect to={`/categories/category/${this.props.active}`} />;
      }
      return el;
    }
    const {
      handleSubmit,
      isCreating,
      actions,
      isMobile,
      navTitle,
      categoriesQuery,
      categoriesSuggestions,
      categoriesLoading,
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
            onSubmit={handleSubmit(actions.onSubmit)}
            className="create-post-form"
          >
            <Header>
              <Heading className="new-post-create-title">New category</Heading>
            </Header>
            <FormFields>
              <Field
                name="name"
                label="Name"
                id="create-category-name"
                placeholder="Name your category"
                onValueUpdate={actions.categoriesGetSuggestions}
                component={FormTextInput}
              />
              <Suggestions
                query={categoriesQuery}
                suggestions={categoriesSuggestions}
                loading={categoriesLoading}
              />
              <Field
                name="blurb"
                label="Description"
                id="create-category-blurb"
                placeholder="Provide a brief description of this category."
                component={FormTextArea}
              />
              {
                // TODO: add private groups
                // <Field
                //   name="private"
                //   label="Private"
                //   id="create-category-private"
                //   component={FormCheckBox}
                // />
              }
            </FormFields>
            <Footer pad={{ vertical: 'medium' }}>
              <Button
                plain
                label="submit"
                onClick={handleSubmit(actions.onSubmit)}
              />
            </Footer>
          </Form>
        </Section>
      );
  }
};

const mapStateToProps = ({ navbar, categories, responsive, post }) => ({
  postUpdating: post.creating,
  navTitle: navbar.title,
  active: categories.active,
  submitStatus: categories.submitStatus,
  categoriesQuery: categories.categorySuggestions.query,
  isCreating: categories.isCreating,
  isMobile: getIsMobile(responsive),
  initialValues: categories.initialValues,
  categoriesSuggestions: categories.categorySuggestions.results,
  categoriesLoading: categories.categorySuggestions.loading,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    postSetCreating,
    categoriesSetSubmitStatus,
    categoriesResetCreateData,
    onSubmit: categoriesCreateNew,
    changeFormValue,
    categoriesGetSuggestions,
    categoriesSetActive,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'createCategory',
    validate,
    warn,
  })(NewCategory)
);
