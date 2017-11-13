const lengths = {
  body: 800,
};

export const validate = values => {
  const errors = {};
  if (Object.keys(values).length) {
    const { body } = values;
    if (body && body.length > lengths.body) {
      errors.body = 'Too long';
    }
  }
  return errors;
};

export const warn = values => {
  const warn = {};
  if (Object.keys(values).length) {
    const { body } = values;
    warn.body = `${lengths.body - body.length} characters left`;
  }
  return warn;
};
