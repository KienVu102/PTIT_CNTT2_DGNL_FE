import ProductRow from './ProductRow';

export default function ProductTable({ products }) {
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
            <ProductRow key={sp.id} product={sp} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
