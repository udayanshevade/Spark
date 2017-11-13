const lengths = {
  title: 70,
  body: 800,
}

export const validate = values => {
  const errors = {};
  if (Object.keys(values).length) {
    const { title, body, category } = values;
    if (!title) {
      errors.title = 'Required';
    } else if (title && title.length > lengths.title) {
      errors.title = 'Too long';
    }
    if (body && body.length > lengths.body) {
      errors.body = 'Too long';
    }
    if (!category) {
      errors.category = 'Required';
    }
  }
  return errors;
};

export const warn = values => {
  const warn = {};
  if (Object.keys(values).length) {
    const { title, body } = values;
    warn.title = `${lengths.title - title.length} characters left`;
    warn.body = `${lengths.body - body.length} characters left`;
  }
  return warn;
};