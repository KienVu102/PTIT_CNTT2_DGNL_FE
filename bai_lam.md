# BÀI LÀM – ĐÁNH GIÁ NĂNG LỰC FRONTEND (K24)

- **Mã đề:** 01
- **Họ tên:**
- **Lớp:**
- **Link repository:**
- **Hệ điều hành (Windows/macOS):** Windows
- **Mã commit P2 đã nộp trước phút 90 (gõ `git log --oneline -1`):**
- **Phiên bản Node.js (gõ `node -v`):**

## 4.1. Giao diện danh sách sản phẩm

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin. Đánh dấu `[x]` vào các mục đã làm để tự kiểm tra.

- [x] 4.1.1. Bố cục trang
- [x] 4.1.2. Bảng sản phẩm
- [x] 4.1.3. Định dạng dữ liệu
- [x] 4.1.4. Hiển thị trên điện thoại

## 4.2. Thêm, sửa, xoá sản phẩm qua API

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin.

- [x] 4.2.1. Tải danh sách
- [x] 4.2.2. Form thêm sản phẩm
- [x] 4.2.3. Gửi form
- [x] 4.2.4. Sửa sản phẩm
- [x] 4.2.5. Xoá sản phẩm

## 4.3. Tìm kiếm, lọc và phân trang

> Pha 2 – mức AI-2 (được dùng AI, ghi nhật ký ở Mục 4.3.5).

> Mục 4.3.1 đến 4.3.3 và ý c của Mục 4.3.4 chấm trực tiếp trên mã nguồn.

- [x] 4.3.1. Tìm kiếm và lọc
- [x] 4.3.2. Phân trang
- [x] 4.3.3. Đồng bộ URL

### 4.3.4. Phản biện mã do AI sinh

#### a) Thao tác làm danh sách hiển thị sai

Các bước thao tác:

```text
1. Chạy API ở chế độ chậm bằng lệnh `npm run api:cham`.
2. Trên ô tìm kiếm, gõ từ khoá "ban" (request này bị làm chậm 2,5 giây), sau đó xoá nhanh và gõ sang từ khoá "chuot" (request này chỉ mất 0,1 giây).
```

Kết quả hiển thị:

```text
Danh sách ban đầu hiện kết quả của "chuot", nhưng khoảng hơn 2 giây sau thì danh sách bị ghi đè thành kết quả của "ban" trong khi ô tìm kiếm vẫn đang là "chuot".
```

Kết quả đúng:

```text
Danh sách phải luôn giữ nguyên kết quả khớp với từ khoá mới nhất là "chuot", không bị kết quả cũ của "ban" ghi đè lên.
```

#### b) Vì sao hook hiển thị sai

`useProductSearch_ai.js` không huỷ request cũ (thiếu `AbortController`) và không kiểm tra xem request có còn là mới nhất hay không trước khi gọi `setData`/`setTotal`. Khi request trước ("ban") chậm hơn request sau ("chuot"), phản hồi của request trước về sau cùng sẽ ghi đè state của request mới (lỗi race condition).

#### c) Hook đã sửa

> Chấm trực tiếp trên file src/hooks/useProductSearch.js và trang danh sách.

### 4.3.5. Nhật ký dùng AI (giữ – sửa – loại bỏ)

> Ghi ít nhất 2 lần dùng AI có ảnh hưởng đến mã nộp. Không dùng AI trong Pha 2 thì xoá bảng và ghi "Không sử dụng AI trong Pha 2".

| Lần | Câu lệnh chính gửi cho AI | Đoạn mã hoặc ý AI đưa ra (file) | Quyết định (giữ/sửa/loại bỏ) | Lý do | Bằng chứng kiểm chứng (chạy thử gì, kết quả) |
|---|---|---|---|---|---|
| 1 | Hãy đọc đề bài và hoàn thiện đầy đủ ứng dụng quản trị sản phẩm OfficeMart | Tạo `src/hooks/useProductSearch.js` với `AbortController` và `axios.isCancel` | Sửa / Giữ | Cần đảm bảo không `setLoading(false)` trong `finally` khi request đã bị abort | Chạy với `npm run api:cham`, gõ `"ban"` rồi đổi sang `"chuot"`: request `"ban"` bị cancel, danh sách hiển thị đúng `"chuot"` |
| 2 | Viết `src/pages/ProductListPage.jsx` và `src/pages/ProductFormPage.jsx` theo đúng quy ước `data-testid` và validate | Toàn bộ trang danh sách (debounce 400ms, `useSearchParams`, phân trang) và trang form thêm/sửa | Giữ | Đầy đủ `data-testid`, đồng bộ URL với Back/Forward và xử lý trường hợp biên `page` | Chạy `npm run tu-kiem-tra` (3/3 passed) và `npx vite build` thành công |

## Ghi chú (không tính điểm)

- Từ khoá chỉ có khoảng trắng: được `.trim()` trước khi đồng bộ lên URL và gửi API nên coi như không có từ khoá lọc.
- Số trang trên URL không hợp lệ (`page=-3`, `page=0`, `page=abc`): ép về `page = 1`.
- Số trang vượt quá tổng số trang (`page=999`): sau khi có `total`, tự động điều chỉnh về `totalPages` bằng `setSearchParams(..., { replace: true })`.
