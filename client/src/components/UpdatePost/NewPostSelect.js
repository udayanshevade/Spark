import React from 'react';
import FormField from 'grommet/components/FormField';
import SearchInput from 'grommet/components/SearchInput';

const NewPostSelect = ({
  options,
  placeholder,
  onSearch,
  help,
  input,
  id,
  label,
  meta: {
    touched,
    error,
  },
  updateCategory,
  updateSelectInput,
}) => (
  <FormField
    label={label}
    error={touched && error ? error : null}
    help={touched && !input.value ? help : null}
  >
    <SearchInput
      id={id}
      { ...input }
      placeHolder={placeholder}
      suggestions={options}
      onDOMChange={(e) => {
        updateCategory(e.target.value);
        updateSelectInput(e.target.value);
        onSearch(e.target.value);
      }}
      value={input.value}
      onSelect={(e) => {
        updateSelectInput(e.suggestion);
        updateCategory(e.suggestion);
      }}
    />
  </FormField>
);

export default NewPostSelect;
