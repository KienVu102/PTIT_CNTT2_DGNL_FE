import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosClient';
import useProductSearch from '../hooks/useProductSearch';
import ProductTable from '../components/ProductTable';

export default function TrangDanhSach({ hienThongBao }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const qUrl = (searchParams.get('q') ?? '').trim();
  const categoryUrl = searchParams.get('category') ?? '';
  const statusUrl = searchParams.get('status') ?? '';
  const pageRaw = Number(searchParams.get('page') || 1);
  const page = Number.isInteger(pageRaw) && pageRaw >= 1 ? pageRaw : 1;

  const [tuKhoa, setTuKhoa] = useState(qUrl);
  const [dsDanhMuc, setDsDanhMuc] = useState([]);
  const [reload, setReload] = useState(0);
  const [spCanXoa, setSpCanXoa] = useState(null);
  const [dangXoa, setDangXoa] = useState(false);

  const { data: ds, total, loading: dangTai, error: loi } = useProductSearch({
    q: qUrl,
    category: categoryUrl,
    status: statusUrl,
    page,
    reload,
  });

  const tongTrang = Math.max(1, Math.ceil(total / 10));

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setDsDanhMuc(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setTuKhoa(qUrl);
  }, [qUrl]);

  useEffect(() => {
    const daCat = tuKhoa.trim();
    if (daCat === qUrl) return;

    const idTimer = setTimeout(() => {
      capNhatUrl({ q: daCat, page: 1 });
    }, 400);

    return () => clearTimeout(idTimer);
  }, [tuKhoa, qUrl]);

  useEffect(() => {
    if (!dangTai && !loi && total > 0 && page > tongTrang) {
      capNhatUrl({ page: tongTrang }, true);
    }
  }, [dangTai, loi, total, page, tongTrang]);

  function capNhatUrl(thayDoi, replace = false) {
    const moi = new URLSearchParams(searchParams);
    Object.entries(thayDoi).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) {
        moi.delete(k);
      } else {
        moi.set(k, String(v));
      }
    });
    setSearchParams(moi, { replace });
  }

  const mapDanhMuc = {};
  dsDanhMuc.forEach((c) => {
    mapDanhMuc[c.id] = c.name;
  });

  async function xacNhanXoa() {
    if (!spCanXoa || dangXoa) return;
    setDangXoa(true);
    try {
      await api.delete(`/products/${spCanXoa.id}`);
      setSpCanXoa(null);
      hienThongBao('Đã xoá sản phẩm');
      setReload((n) => n + 1);
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

      <div className="bo-loc">
        <input
          type="text"
          className="o-tim"
          data-testid="search-input"
          placeholder="Tìm theo tên hoặc SKU..."
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
        />

        <select
          className="o-loc"
          data-testid="category-filter"
          value={categoryUrl}
          onChange={(e) => capNhatUrl({ category: e.target.value, page: 1 })}
        >
          <option value="">Tất cả</option>
          {dsDanhMuc.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="o-loc"
          data-testid="status-filter"
          value={statusUrl}
          onChange={(e) => capNhatUrl({ status: e.target.value, page: 1 })}
        >
          <option value="">Tất cả</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
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
            onClick={() => setReload((n) => n + 1)}
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
        <>
          <ProductTable
            products={ds}
            dsDanhMuc={dsDanhMuc.length > 0 ? mapDanhMuc : undefined}
            onEdit={(sp) => navigate(`/products/${sp.id}/edit`)}
            onDelete={(sp) => setSpCanXoa(sp)}
          />

          <div className="phan-trang" data-testid="pagination">
            <button
              type="button"
              className="nut-sua"
              data-testid="page-prev"
              disabled={page <= 1}
              onClick={() => capNhatUrl({ page: page - 1 })}
            >
              Trước
            </button>
            <span data-testid="page-current">
              {page} / {tongTrang}
            </span>
            <button
              type="button"
              className="nut-sua"
              data-testid="page-next"
              disabled={page >= tongTrang}
              onClick={() => capNhatUrl({ page: page + 1 })}
            >
              Sau
            </button>
          </div>
        </>
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
