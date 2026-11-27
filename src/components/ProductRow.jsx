import { categoryNames } from '../data/sample';

export default function ProductRow({ product }) {
  return (
    <tr data-testid="product-row">
      <td data-label="Tên">{product.name}</td>
      <td data-label="SKU">{product.sku}</td>
      <td data-label="Danh mục">{categoryNames[product.category] || product.category}</td>
      <td data-label="Giá">{product.price.toLocaleString('vi-VN')} ₫</td>
      <td data-label="Tồn kho">
        {product.stock === 0 ? <span className="chu-do">Hết hàng</span> : product.stock}
      </td>
      <td data-label="Trạng thái">
        <span
          data-testid="product-status"
          className={product.status === 'active' ? 'nhan xanh' : 'nhan xam'}
        >
          {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
        </span>
      </td>
      <td data-label="Thao tác">
        <div className="cum-nut">
          <button type="button" className="nut-sua" data-testid="edit-button">
            Sửa
          </button>
          <button type="button" className="nut-xoa" data-testid="delete-button">
            Xoá
          </button>
        </div>
      </td>
    </tr>
  );
}
