export default function App() {
  return (
    <div>
      <header className="dau-trang">OfficeMart Admin</header>

      <main className="khung">
        <div className="dong-tren">
          <h1>Sản phẩm</h1>
          <button type="button" className="nut-them">
            Thêm sản phẩm
          </button>
        </div>

        <div className="khung-bang">
          <table className="bang-sp">
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
                  <span className="nhan xanh">Đang bán</span>
                </td>
                <td>
                  <div className="cum-nut">
                    <button type="button" className="nut-sua">Sửa</button>
                    <button type="button" className="nut-xoa">Xoá</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Chuột công thái học Vertical</td>
                <td>MOU-0007</td>
                <td>Chuột</td>
                <td>200.000 ₫</td>
                <td>9</td>
                <td>
                  <span className="nhan xam">Ngừng bán</span>
                </td>
                <td>
                  <div className="cum-nut">
                    <button type="button" className="nut-sua">Sửa</button>
                    <button type="button" className="nut-xoa">Xoá</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Màn hình 24 inch FHD</td>
                <td>MON-0003</td>
                <td>Màn hình</td>
                <td>2.060.000 ₫</td>
                <td>
                  <span className="chu-do">Hết hàng</span>
                </td>
                <td>
                  <span className="nhan xanh">Đang bán</span>
                </td>
                <td>
                  <div className="cum-nut">
                    <button type="button" className="nut-sua">Sửa</button>
                    <button type="button" className="nut-xoa">Xoá</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
