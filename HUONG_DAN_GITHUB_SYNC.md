# 📄 HƯỚNG DẪN ĐỒNG BỘ GITHUB (LƯU ONLINE)

**TIN VUI:** Hiện tại em Tân đã cài đặt sẵn "Chìa khóa" vào App cho anh rồi. Mọi người **KHÔNG CẦN** làm theo các bước tạo Token hay Repo phức tạp nữa.

---

## ✅ TRẠNG THÁI HIỆN TẠI: ĐÃ KẾT NỐI
App của bạn đã được kết nối sẵn với kho dữ liệu GitHub của Admin (**optruong12a9-gif**).

### Mọi người chỉ cần làm:
1. Mở App Chấm Công lên.
2. Đăng nhập đúng tên của mình (Mật khẩu mặc định là `123456`).
3. Thế là xong! Dữ liệu sẽ tự động tải về và tự động đồng bộ khi bạn bấm **Lưu**.

---

## 🛠️ DÀNH RIÊNG CHO ADMIN (NẾU MUỐN THAY ĐỔI)
Nếu sau này anh muốn đổi sang một kho GitHub khác, anh mới cần làm các bước sau:

1. Đăng nhập vào GitHub (nếu chưa có thì tạo 1 cái tài khoản miễn phí tại github.com).
2. Bấm vào ảnh đại diện (góc trên bên phải) -> Chọn **Settings**.
3. Kéo xuống dưới cùng thanh bên trái, chọn **Developer settings**.
4. Chọn **Personal access tokens** -> Sau đó chọn **Tokens (classic)**.
5. Bấm nút **Generate new token** -> Chọn **Generate new token (classic)**.
6. Ô **Note**: Nhập chữ `App-Cham-Cong`.
7. Ô **Expiration**: Chọn `No expiration` (Để dùng mãi mãi không bị hết hạn).
8. **QUAN TRỌNG:** Tích vào ô vuông đầu tiên có chữ **repo** (Nó sẽ tự tích hết các ô con bên dưới).
9. Kéo xuống dưới cùng bấm nút xanh **Generate token**.
10. **LƯU Ý:** Bạn sẽ thấy một dãy chữ cái và số dài (Ví dụ: `ghp_abcd123...`). **HÃY COPY DÃY NÀY VÀ LƯU LẠI**, vì nó chỉ hiện ra 1 lần duy nhất! Nếu mất bạn sẽ phải tạo lại mã mới.

---

## 2️⃣ BƯỚC 2: TẠO KHO LƯU TRỮ (REPOSITORY)
*Đây là "cái tủ" để chứa file dữ liệu của bạn.*

1. Quay lại trang chủ GitHub (bấm vào biểu tượng con mèo ở góc trên trái).
2. Bấm nút xanh **New** (ở thanh bên trái) để tạo Repository mới.
3. Ô **Repository name**: Nhập tên (viết liền, không dấu). Ví dụ: `du-lieu-cham-cong`.
4. Chọn chế độ **Private** (Để chỉ bạn và App có quyền xem, người ngoài không thấy được).
5. Tích vào ô **Add a README file**.
6. Kéo xuống bấm nút xanh **Create repository**.

---

## 3️⃣ BƯỚC 3: CÀI ĐẶT VÀO APP
*Bây giờ bạn kết nối App với cái tủ vừa tạo.*

1. Mở App Chấm Công của bạn lên.
2. Bấm vào nút hình đám mây **☁️** ở góc trên bên phải.
3. **Ô Token**: Dán cái dãy mã bí mật vừa copy (ở Bước 1) vào đây.
4. **Ô Repository**: Nhập theo đúng định dạng: `tên-của-bạn/tên-kho-vừa-tạo`.
   * Ví dụ: Nếu tên GitHub của bạn là `tannguyen` và bạn tạo kho là `du-lieu-cham-cong`, thì nhập là: `tannguyen/du-lieu-cham-cong`
5. **Ô Branch**: Để nguyên là `main`.
6. Bấm nút **🔍 Kiểm tra kết nối**. Nếu hiện chữ **✅ Kết nối thành công** thì chúc mừng bạn!
7. Bấm nút **💾 Lưu cấu hình**.

---

## 💡 CÁCH SỬ DỤNG HÀNG NGÀY
- Mỗi khi bạn nhấn nút **Lưu** (màu xanh trên máy), App sẽ tự động làm 2 việc: Lưu vào máy bạn và Gửi lên GitHub.
- Nếu bạn thấy biểu tượng ☁️ màu xanh lá cây và hiện giờ vừa lưu, nghĩa là đã xong.
- **Xem online:** Mọi người chỉ cần dùng chung cái Token và Repository này trên App của họ là sẽ thấy dữ liệu của nhau ngay lập tức!

---

> [!TIP]
> **Mẹo:** Nếu bạn đổi sang điện thoại mới, chỉ cần nhập lại thông tin Token và Repo này rồi bấm **"Khôi phục từ GitHub"** là toàn bộ dữ liệu cũ sẽ hiện ra đầy đủ mà không cần nhập lại từ đầu!
