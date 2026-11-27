export default function App() {
  return (
    <div>
      <header className="header">OfficeMart Admin</header>

      <div className="content">
        <div className="top-row">
          <h2>Sản phẩm</h2>
          <button className="add-btn">Thêm sản phẩm</button>
        </div>

        <div className="table-wrap">
          <table>
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
              <tr>
                <td>Màn hình 27 inch 2K</td>
                <td>MON-0008</td>
                <td>Màn hình</td>
                <td>3.820.000 ₫</td>
                <td>3</td>
                <td>
                  <span className="tag tag-on">Đang bán</span>
                </td>
                <td>
                  <div className="btn-group">
                    <button className="btn-sua">Sửa</button>
                    <button className="btn-xoa">Xoá</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
