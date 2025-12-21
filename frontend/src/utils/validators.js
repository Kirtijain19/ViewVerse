export const isEmail = (value) => {
  if (!value) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value).toLowerCase());
};

export const isRequired = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const minLength = (value, len) => {
  if (typeof value !== 'string') return false;
  return value.trim().length >= len;
};

export const maxLength = (value, len) => {
  if (typeof value !== 'string') return false;
  return value.trim().length <= len;
};

export const isStrongPassword = (value) => {
  if (typeof value !== 'string') return false;
  // at least 8 chars, 1 number, 1 lower, 1 upper
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
};
