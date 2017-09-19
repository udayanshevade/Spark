import React from 'react';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';

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
}) => (
  <FormField
    label={label}
    error={touched && error ? error : null}
    help={touched && !input.value ? help : null}
  >
    <Select
      id={id}
      { ...input }
      placeHolder={placeholder}
      options={options}
      onSearch={onSearch}
    />
  </FormField>
);

export default NewPostSelect;
