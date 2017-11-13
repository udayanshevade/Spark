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
import { FormTextInput, FormTextArea, FormCheckBox } from '../Forms';
import Loading from '../Loading';
import { validate, warn } from './validation';
import {
  categoriesCreateNew,
  categoriesGetSuggestions,
  categoriesSetActive,
} from '../../actions/categories';
import { getIsMobile } from '../../selectors/responsive';

class NewCategory extends Component {
  state = {
    shouldRedirect: false,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isCreating && nextProps.active && !nextProps.isCreating) {
      this.setState({ shouldRedirect: true });
    }
  }

  componentWillUnmount() {
    this.setState({ shouldRedirect: false });
    this.props.actions.categoriesSetActive('');
  }

  render() {
    if (this.state.shouldRedirect) {
      return <Redirect to={`/categories/category/${this.props.active}`} />
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
              <Field
                name="private"
                label="Private"
                id="create-category-private"
                component={FormCheckBox}
              />
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

const mapStateToProps = ({ navbar, categories, responsive }) => ({
  navTitle: navbar.title,
  active: categories.active,
  categoriesQuery: categories.categorySuggestions.query,
  isCreating: categories.isCreating,
  isMobile: getIsMobile(responsive),
  initialValues: { ...categories.emptyValues },
  categoriesSuggestions: categories.categorySuggestions.results,
  categoriesLoading: categories.categorySuggestions.loading, 
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    onSubmit: categoriesCreateNew,
    changeFormValue,
    categoriesGetSuggestions,
    categoriesSetActive,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'createCategory',
    validate,
    warn,
  })(NewCategory)
);
