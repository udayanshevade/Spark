import React from 'react';
import FormField from 'grommet/components/FormField';
import SearchInput from 'grommet/components/SearchInput';

const FormSelectInput = ({
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
  onUpdateValue,
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
        if (onUpdateValue) {
          onUpdateValue(e.target.value);
        }
        if (onSearch) {
          onSearch(e.target.value);
        }
      }}
      value={input.value}
      onSelect={(e) => {
        onUpdateValue(e.suggestion);
      }}
    />
  </FormField>
);

export default FormSelectInput;
