import React from 'react';
import FormField from 'grommet/components/FormField';

const FormTextArea = ({
  placeholder,
  input: {
    onChange: onFormChange,
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
  val,
}) => {
  return (
    <FormField
      label={label}
      error={touched && error ? error : null}
      help={active && warning ? warning : null}
    >
      <textarea
        id={id}
        rows={5}
        type="text"
        { ...input }
        onChange={(e) => {
          onFormChange(e.target.value);
          if (onValueUpdate) {
            onValueUpdate(e.target.value);
          }
        }}
        value={val || input.value}
        placeholder={placeholder}
      />
    </FormField>
  );
};

export default FormTextArea;
