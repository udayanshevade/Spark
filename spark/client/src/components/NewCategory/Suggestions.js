import React from 'react';
import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Button from 'grommet/components/Button';
import Paragraph from 'grommet/components/Paragraph';

const Suggestions = ({ query, suggestions, loading }) => (
  suggestions.length
    ? (
      <Box
        pad={{ horizontal: 'medium', vertical: 'small' }}
        direction="column"
        className="categories-suggestions-list-container"
      >
        <Paragraph className="categories-suggestions-title">Are these relevant:</Paragraph>
        <List
          className="categories-suggestions-list"
        >
          {
            suggestions.map(suggestion => (
              <ListItem
                key={`category-suggestion-${suggestion}`}
                className={`categories-suggestions-list-item ${query === suggestion ? 'categories-suggestions-list-item--matched' : ''}`}
              >
                <Button
                  plain
                  path={`/categories/category/${suggestion}`}
                  label={suggestion}
                />
              </ListItem>
            ))
          }
        </List>
      </Box>
    )
    : null
);

export default Suggestions;
