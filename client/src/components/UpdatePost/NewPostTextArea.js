import React from 'react';
import FormField from 'grommet/components/FormField';

const NewPostTextArea = ({ placeholder, input, id, label, meta: { active, touched, error, warning } }) => (
  <FormField
    label={label}
    error={touched && error ? error : null}
    help={active && warning ? warning : null}
  >
    <textarea id={id} rows={5} type="text" { ...input } placeholder={placeholder} />
  </FormField>
);

export default NewPostTextArea;
