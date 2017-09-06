import React from 'react';
import { Grid } from 'semantic-ui-react';
import Categories from '../Categories';

const Main = () => (
  <Grid>
    <Grid.Column width={12} />
    <Categories />
  </Grid>
);

export default Main;
