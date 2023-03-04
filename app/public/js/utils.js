export const collectFormData = (form) => {
  const inputs = form.querySelectorAll('input, textarea, select');
  const data = {};
  inputs.forEach(input => {
    if (input.getAttribute('id') !== 'active') {
      if (input.type === 'checkbox') {
        data[input.getAttribute('id')] = input.checked;
      } else {
        data[input.getAttribute('id')] = input.value;
      }
    }
  });
  return data;
};