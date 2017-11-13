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
  touch,
  onUpdateValue,
}) => {
  return (
    <FormField
      label={label}
      error={touched && error ? error : null}
      help={touched && help ? help : null}
      onFocus={() => {
        touch();
      }}
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
        onSelect={(e) => {
          onUpdateValue(e.suggestion);
        }}
      />
    </FormField>
  );
};

export default FormSelectInput;
