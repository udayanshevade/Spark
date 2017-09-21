import React from 'react';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';

const NewPostInput = ({
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
}) => (
  <FormField
    label={label}
    error={touched && error ? error : null}
    help={active && warning ? warning : null}
  >
    <TextInput id={id} placeHolder={placeholder} onDOMChange={onChange} {...input} />
  </FormField>
);

export default NewPostInput;
