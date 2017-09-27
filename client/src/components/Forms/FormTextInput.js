import React from 'react';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';

const FormTextInput = ({
  placeholder,
  input: {
    onChange,
    ...input,
  },
  id,
  label,
  meta: {
    active,
    touched,
    error,
    warning,
  },
  onValueUpdate,
}) => (
  <FormField
    label={label}
    error={touched && error ? error : null}
    help={active && warning ? warning : null}
  >
    <TextInput
      id={id}
      placeHolder={placeholder}
      {...input}
      onDOMChange={(e) => {
        onChange(e.target.value);
        if (onValueUpdate) {
          onValueUpdate(e.target.value);
        }
      }}
    />
  </FormField>
);

export default FormTextInput;
