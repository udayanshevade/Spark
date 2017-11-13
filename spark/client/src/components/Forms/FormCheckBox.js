import React from 'react';
import FormField from 'grommet/components/FormField';
import CheckBox from 'grommet/components/CheckBox';

const FormTextInput = ({
  placeholder,
  input: {
    onChange: onFormChange,
    ...input,
  },
  id,
  label,
  meta: { warning },
  help,
  onValueUpdate,
}) => (
  <FormField
    help={warning}
    label={label}
  >
    <CheckBox
      {...input}
      toggle
      onChange={(e) => {
        onFormChange(e.target.checked);
        if (onValueUpdate) onValueUpdate(e.target.checked);
      }}
    />
  </FormField>
);

export default FormTextInput;
