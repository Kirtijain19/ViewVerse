import { useState, useCallback } from 'react';
import useAuth from './useAuth';

const useFetch = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(
    async (url, { method = 'GET', body = null, headers = {} } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const opts = {
          method,
          headers: {
            ...headers,
          },
        };

        if (token) {
          opts.headers.Authorization = `Bearer ${token}`;
        }

        if (body && !(body instanceof FormData)) {
          opts.headers['Content-Type'] = 'application/json';
          opts.body = JSON.stringify(body);
        } else if (body instanceof FormData) {
          opts.body = body;
        }

        const res = await fetch(url, opts);
        const contentType = res.headers.get('content-type') || '';
        let payload = null;
        if (contentType.includes('application/json')) {
          payload = await res.json();
        } else {
          payload = await res.text();
        }

        if (!res.ok) {
          const message = (payload && payload.message) || res.statusText || 'Request failed';
          throw new Error(message);
        }

        setData(payload);
        return payload;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { loading, error, data, request, setData, setError };
};

export default useFetch;