import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axiosClient.js';

export default function useProductSearch({ q = '', category = '', status = '', page = 1, reload = 0 }) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = { page, limit: 10 };
        if (q) params.q = q;
        if (category) params.category = category;
        if (status) params.status = status;

        const res = await api.get('/products', {
          params,
          signal: controller.signal,
        });
        setData(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err.response?.data?.message || 'Không tải được danh sách sản phẩm');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [q, category, status, page, reload]);

  return { data, total, loading, error };
}

