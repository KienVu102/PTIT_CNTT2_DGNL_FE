import ProductRow from './ProductRow';

export default function ProductTable({ products = [], dsDanhMuc, onEdit, onDelete }) {
  return (
    <div className="khung-bang">
      <table className="bang-sp" data-testid="product-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>SKU</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((sp) => (
            <ProductRow
              key={sp.id}
              product={sp}
              dsDanhMuc={dsDanhMuc}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
