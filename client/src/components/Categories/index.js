import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordion from 'grommet/components/Accordion';
import AccordionPanel from 'grommet/components/AccordionPanel';
import ListPlaceHolder from 'grommet-addons/components/ListPlaceholder';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Loading from '../Loading';
import Navbar from '../Navbar';
import * as categoriesActions from '../../actions/categories';

export const CategoriesComponent = ({ query, depleted, loading, categories, actions, active }) => {
  let categoriesEl;
  if (loading) {
    categoriesEl = <Loading />;
  } else if (!categories.length) {
    categoriesEl = (
      <ListPlaceHolder
        filteredTotal={categories.length}
      />
    );
  } else {
    categoriesEl = (
      <Accordion className="categories-list-items-container">
        {categories.map(({ name, blurb, subscribers }, i) => (
          <AccordionPanel
            key={`list-category-item-${i}`}
            heading={name}
            pad="medium"
          >
            <Box direction="column">
              <Paragraph className="category-description">
                <b>{subscribers}</b> {`subscriber${+subscribers === 1 ? '' : 's'}`}
              </Paragraph>
              {
                blurb &&
                  <Paragraph className="category-description">
                    {blurb}
                  </Paragraph>
              }
              <Button
                plain
                path={`/categories/category/${name}`}
                label="more"
                className="category-link"
              />
            </Box>
          </AccordionPanel>
        ))}
      </Accordion>
    );
  }
  return (
    <div>
      <Navbar />
      <Box direction="column" align="end">
        <Button
          plain
          path="/categories/create"
          label="Create"
          className="category-link create-category-link"
        />
      </Box>
      {categoriesEl}
      {
        !(depleted || loading) &&
          <Footer justify="center">
            <Button
              plain
              label="Load more"
              onClick={() => {
                actions.categoriesLoadData(query);
              }}
            />
          </Footer>
      }
    </div>
  );
}

CategoriesComponent.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ),
  actions: PropTypes.shape({
    categoriesSetActive: PropTypes.func,
  }),
  activeCategory: PropTypes.string,
};

const mapStateToProps = ({ categories }) => ({
  depleted: categories.depleted,
  query: categories.query,
  loading: categories.loading,
  categories: categories.categories,
  active: categories.active,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...categoriesActions,
  }, dispatch),
});

const Categories = connect(mapStateToProps, mapDispatchToProps)(CategoriesComponent);

export default Categories;
