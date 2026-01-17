# Hướng dẫn đưa ứng dụng lên GitHub Pages và dùng Offline trên iPhone

Để ứng dụng **Chấm Công** của bạn hoạt động offline và có biểu tượng riêng trên iPhone, hãy làm theo các bước sau:

## Bước 1: Đưa code lên GitHub
1.  Truy cập [github.com](https://github.com/) và tạo một tài khoản (nếu chưa có).
2.  Tạo một Repository mới (đặt tên là `cham-cong`). Chọn **Public**.
3.  Tải (Upload) tất cả các file trong thư mục `CHẤM CÔNG` lên repository này. Các file quan trọng nhất là:
    *   `index.html`
    *   `style.css`
    *   `app.js`
    *   `logo.jpg`
    *   `manifest.json`
    *   `sw.js`

## Bước 2: Kích hoạt GitHub Pages
1.  Vào phần **Settings** của repository đó.
2.  Chọn mục **Pages** ở cột bên trái.
3.  Tại phần **Build and deployment**, ở mục **Branch**, chọn `main` và nhấn **Save**.
4.  Chờ khoảng 1-2 phút, GitHub sẽ cung cấp một đường link (ví dụ: `https://ten-cua-ban.github.io/cham-cong/`).

## Bước 3: Cài đặt vào màn hình chính iPhone (Để dùng Offline)
1.  Mở trình duyệt **Safari** trên iPhone.
2.  Truy cập vào đường link GitHub Pages của bạn.
3.  Nhấn vào nút **Chia sẻ (Share)** (biểu tượng hình vuông có mũi tên lên ở giữa dưới màn hình).
4.  Kéo xuống dưới và chọn **Thêm vào màn hình chính (Add to Home Screen)**.
5.  Nhấn **Thêm (Add)**.

---
> [!IMPORTANT]
> **Cách dùng Offline:**
> Sau khi đã "Thêm vào màn hình chính", bạn hãy mở ứng dụng từ icon ngoài màn hình iPhone ít nhất một lần khi có mạng để ứng dụng lưu dữ liệu. Sau đó, bạn có thể tắt mạng và sử dụng bình thường. Mọi dữ liệu bạn nhập vẫn sẽ được lưu lại trên máy của bạn (localStorage).

> [!TIP]
> Nếu bạn thay đổi logo, hãy đảm bảo file ảnh vẫn tên là `logo.jpg` để biểu tượng trên iPhone hiển thị đúng.
