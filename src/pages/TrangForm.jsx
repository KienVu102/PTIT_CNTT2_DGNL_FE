import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosClient';

export default function TrangForm({ hienThongBao }) {
  const { id } = useParams();
  const laSua = Boolean(id);
  const navigate = useNavigate();

  const [dsDanhMuc, setDsDanhMuc] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    status: 'active',
  });
  const [loiTruong, setLoiTruong] = useState({});
  const [loiChung, setLoiChung] = useState('');
  const [dangTai, setDangTai] = useState(laSua);
  const [khongTimThay, setKhongTimThay] = useState(false);
  const [dangLuu, setDangLuu] = useState(false);

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setDsDanhMuc(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!laSua) return;
    setDangTai(true);
    setKhongTimThay(false);

    api
      .get(`/products/${id}`)
      .then((res) => {
        const sp = res.data;
        setForm({
          name: sp.name ?? '',
          sku: sp.sku ?? '',
          category: sp.category ?? '',
          price: String(sp.price ?? ''),
          stock: String(sp.stock ?? ''),
          status: sp.status ?? 'active',
        });
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setKhongTimThay(true);
        } else {
          setLoiChung(err.response?.data?.message || 'Lỗi khi tải sản phẩm');
        }
      })
      .finally(() => setDangTai(false));
  }, [id, laSua]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (loiTruong[name]) {
      setLoiTruong({ ...loiTruong, [name]: '' });
    }
  }

  function kiemTraForm() {
    const err = {};
    const ten = form.name.trim();
    if (ten.length < 3 || ten.length > 100) {
      err.name = 'Tên phải từ 3 đến 100 ký tự';
    }
    if (!/^[A-Z]{3}-\d{4}$/.test(form.sku)) {
      err.sku = 'SKU phải đúng dạng ABC-1234';
    }
    if (!form.category) {
      err.category = 'Vui lòng chọn danh mục';
    }
    if (form.price === '' || !(Number(form.price) > 0)) {
      err.price = 'Giá phải lớn hơn 0';
    }
    const ton = Number(form.stock);
    if (form.stock === '' || !Number.isInteger(ton) || ton < 0) {
      err.stock = 'Tồn kho phải là số nguyên không âm';
    }
    return err;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (dangLuu) return;

    const err = kiemTraForm();
    if (Object.keys(err).length > 0) {
      setLoiTruong(err);
      return;
    }

    setDangLuu(true);
    setLoiChung('');
    setLoiTruong({});

    const duLieu = {
      name: form.name.trim(),
      sku: form.sku,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      status: form.status,
    };

    try {
      if (laSua) {
        await api.put(`/products/${id}`, duLieu);
        hienThongBao('Đã cập nhật sản phẩm');
      } else {
        await api.post('/products', duLieu);
        hienThongBao('Đã thêm sản phẩm');
      }
      navigate('/products');
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      if ((status === 400 || status === 409) && data?.field) {
        setLoiTruong({ [data.field]: data.message });
      } else if (status === 404) {
        setKhongTimThay(true);
      } else {
        setLoiChung(data?.message || 'Có lỗi xảy ra khi lưu');
      }
    } finally {
      setDangLuu(false);
    }
  }

  if (dangTai) {
    return (
      <div className="hop-trang-thai" data-testid="loading">
        Đang tải...
      </div>
    );
  }

  if (khongTimThay) {
    return (
      <div className="hop-trang-thai hop-loi" data-testid="error-message">
        <p>Không tìm thấy sản phẩm</p>
        <button type="button" className="nut-sua" onClick={() => navigate('/products')}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="khung-form">
      <div className="dong-tren">
        <h1>{laSua ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
        <button type="button" className="nut-sua" onClick={() => navigate('/products')}>
          Quay lại
        </button>
      </div>

      {loiChung && (
        <div className="hop-trang-thai hop-loi" data-testid="error-message">
          {loiChung}
        </div>
      )}

      <form className="form-sp" data-testid="product-form" onSubmit={handleSubmit}>
        <div className="o-nhap">
          <label htmlFor="name">Tên sản phẩm</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {loiTruong.name && (
            <p className="loi-nho" data-testid="field-error-name">
              {loiTruong.name}
            </p>
          )}
        </div>

        <div className="o-nhap">
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            placeholder="Ví dụ: KEY-0001"
            value={form.sku}
            onChange={handleChange}
          />
          {loiTruong.sku && (
            <p className="loi-nho" data-testid="field-error-sku">
              {loiTruong.sku}
            </p>
          )}
        </div>

        <div className="o-nhap">
          <label htmlFor="category">Danh mục</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            <option value="">-- Chọn danh mục --</option>
            {dsDanhMuc.map((dm) => (
              <option key={dm.id} value={dm.id}>
                {dm.name}
              </option>
            ))}
          </select>
          {loiTruong.category && (
            <p className="loi-nho" data-testid="field-error-category">
              {loiTruong.category}
            </p>
          )}
        </div>

        <div className="o-nhap">
          <label htmlFor="price">Giá</label>
          <input
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />
          {loiTruong.price && (
            <p className="loi-nho" data-testid="field-error-price">
              {loiTruong.price}
            </p>
          )}
        </div>

        <div className="o-nhap">
          <label htmlFor="stock">Tồn kho</label>
          <input
            id="stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
          />
          {loiTruong.stock && (
            <p className="loi-nho" data-testid="field-error-stock">
              {loiTruong.stock}
            </p>
          )}
        </div>

        <div className="o-nhap">
          <label htmlFor="status">Trạng thái</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
          </select>
        </div>

        <button type="submit" className="nut-them" data-testid="submit-button" disabled={dangLuu}>
          {dangLuu ? 'Đang lưu...' : 'Lưu'}
        </button>
      </form>
    </div>
  );
}

