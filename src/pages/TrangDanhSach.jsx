import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import ProductTable from '../components/ProductTable';

export default function TrangDanhSach({ hienThongBao }) {
  const navigate = useNavigate();
  const [ds, setDs] = useState([]);
  const [dsDanhMuc, setDsDanhMuc] = useState({});
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState('');
  const [spCanXoa, setSpCanXoa] = useState(null);
  const [dangXoa, setDangXoa] = useState(false);

  async function taiDanhSach() {
    setDangTai(true);
    setLoi('');
    try {
      const res = await api.get('/products', { params: { page: 1, limit: 10 } });
      setDs(res.data.data);
    } catch (err) {
      setLoi(err.response?.data?.message || 'Không tải được danh sách sản phẩm');
    } finally {
      setDangTai(false);
    }
  }

  useEffect(() => {
    taiDanhSach();
    api
      .get('/categories')
      .then((res) => {
        const obj = {};
        res.data.forEach((c) => {
          obj[c.id] = c.name;
        });
        setDsDanhMuc(obj);
      })
      .catch(() => {});
  }, []);

  async function xacNhanXoa() {
    if (!spCanXoa || dangXoa) return;
    setDangXoa(true);
    try {
      await api.delete(`/products/${spCanXoa.id}`);
      setDs((cu) => cu.filter((item) => item.id !== spCanXoa.id));
      setSpCanXoa(null);
      hienThongBao('Đã xoá sản phẩm');
    } catch (err) {
      hienThongBao(err.response?.data?.message || 'Xoá thất bại');
    } finally {
      setDangXoa(false);
    }
  }

  return (
    <div>
      <div className="dong-tren">
        <h1>Sản phẩm</h1>
        <button
          type="button"
          className="nut-them"
          data-testid="add-button"
          onClick={() => navigate('/products/new')}
        >
          Thêm sản phẩm
        </button>
      </div>

      {dangTai && (
        <div className="hop-trang-thai" data-testid="loading">
          Đang tải...
        </div>
      )}

      {!dangTai && loi && (
        <div className="hop-trang-thai hop-loi" data-testid="error-message">
          <p>{loi}</p>
          <button
            type="button"
            className="nut-sua"
            data-testid="retry-button"
            onClick={taiDanhSach}
          >
            Thử lại
          </button>
        </div>
      )}

      {!dangTai && !loi && ds.length === 0 && (
        <div className="hop-trang-thai" data-testid="empty-state">
          Không có sản phẩm nào
        </div>
      )}

      {!dangTai && !loi && ds.length > 0 && (
        <ProductTable
          products={ds}
          dsDanhMuc={dsDanhMuc}
          onEdit={(sp) => navigate(`/products/${sp.id}/edit`)}
          onDelete={(sp) => setSpCanXoa(sp)}
        />
      )}

      {spCanXoa && (
        <div className="nen-modal">
          <div className="hop-modal" data-testid="confirm-dialog">
            <h3>Xác nhận xoá</h3>
            <p>Bạn có chắc muốn xoá "{spCanXoa.name}" không?</p>
            <div className="nut-modal">
              <button
                type="button"
                className="nut-sua"
                data-testid="confirm-no"
                onClick={() => setSpCanXoa(null)}
                disabled={dangXoa}
              >
                Huỷ
              </button>
              <button
                type="button"
                className="nut-them"
                data-testid="confirm-yes"
                onClick={xacNhanXoa}
                disabled={dangXoa}
              >
                {dangXoa ? 'Đang xoá...' : 'Đồng ý'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

