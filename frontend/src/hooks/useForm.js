import { useCallback, useState } from 'react';

const useForm = (initial = {}) => {
  const [values, setValues] = useState(initial);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setValues((v) => ({ ...v, [name]: checked }));
    } else if (type === 'file') {
      setValues((v) => ({ ...v, [name]: files }));
    } else {
      setValues((v) => ({ ...v, [name]: value }));
    }
  }, []);

  const reset = useCallback((next = initial) => {
    setValues(next);
  }, [initial]);

  const setField = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
  }, []);

  return { values, setValues, handleChange, reset, setField };
};

export default useForm;