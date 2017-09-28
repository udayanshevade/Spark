const lengths = {
  name: 70,
  blurb: 300,
};

export const validate = (values) => {
  const errors = {};
  if (Object.keys(values).length) {
    const { name, blurb } = values;
    if (!name) {
      errors.name = 'Required';
    } else if (name && name.length > lengths.name) {
      errors.name = 'Too long';
    }
    if (blurb && blurb.length > lengths.blurb) {
      errors.blurb = 'Too long';
    }
  }
  return errors;
};

export const warn = (values) => {
  const warn = {};
  if (Object.keys(values).length) {
    const { name, blurb } = values;
    warn.name = `${lengths.name - name.length} characters left`;
    warn.blurb = `${lengths.blurb - blurb.length} characters left`;
    warn.private = values.private ? 'Allow users to join by invitation only?' : null;
  }
  return warn;
};