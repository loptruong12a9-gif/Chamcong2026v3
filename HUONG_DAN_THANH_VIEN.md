# HƯỚNG DẪN NHẬP DỮ LIỆU CHẤM CÔNG - DÀNH CHO THÀNH VIÊN

## 🔐 BƯỚC 1: ĐĂNG NHẬP

### Mở Ứng Dụng
- Truy cập link ứng dụng chấm công (hoặc mở file `index.html`)
- Hệ thống sẽ hiển thị màn hình đăng nhập

### Nhập Thông Tin
- **Tên đăng nhập**: Chỉ cần nhập **TÊN** của bạn (viết HOA)
  - Ví dụ: Nếu bạn là **NGUYỄN VĂN TÂN** → Nhập: `TÂN`
  - Nếu bạn là **PHẠM THỊ LINH** → Nhập: `LINH`
- **Mật khẩu**: `123456` (mật khẩu mặc định)
- Nhấn **"Đăng nhập"** hoặc phím **Enter**

> **Lưu ý**: Tên phải viết HOA và có dấu đầy đủ

---

## 📅 BƯỚC 2: CHỌN THÁNG

- Ở góc trên bên phải, chọn **tháng** cần nhập dữ liệu
- Bảng chấm công sẽ tự động hiển thị từ **ngày 26 tháng trước** đến **ngày 25 tháng hiện tại**

---

## ✍️ BƯỚC 3: NHẬP DỮ LIỆU

### A. Nhập Giờ Trong Ca (Hàng "TRONG GIỜ")
- Nhập số giờ làm việc bình thường trong ca (tối đa 8 giờ/ngày)
- Ví dụ: `8`, `7.5`, `4`
- Hệ thống sẽ tự động cảnh báo nếu nhập quá 8 giờ

### B. Nhập Giờ Ngoài Giờ (Hàng "NGOÀI GIỜ")
Có 2 cách nhập:

**Cách 1: Nhập số giờ trực tiếp**
```
4
```

**Cách 2: Nhập khoảng thời gian (khuyến nghị)**
```
17H-21H
22H30-2H30
```

> **Mẹo**: Nếu nhập khoảng thời gian, hệ thống sẽ tự động tính số giờ cho bạn!

**Nhập nhiều ca trong 1 ngày** (mỗi ca 1 dòng):
```
7H-11H
17H-21H
```

### C. Chọn Cấu Hình Trực (Hàng "CẤU HÌNH TRỰC")
Click vào ô và chọn:
- **TRỰC CHÍNH**: Trực chính thức
- **TRỰC NGOÀI Ở LẠI**: Trực ngoài giờ, ở lại bệnh viện (+0.5 giờ)
- **TRỰC NGOÀI Ở NHÀ VÔ**: Trực ngoài giờ, ở nhà (+1 giờ)

---

## 💾 BƯỚC 4: LƯU DỮ LIỆU

- Sau khi nhập xong, nhấn nút **"Lưu dữ liệu"** ở góc trên
- Hệ thống sẽ hiển thị thông báo "Đã lưu dữ liệu thành công!"

> **Quan trọng**: Nhớ nhấn "Lưu dữ liệu" sau mỗi lần chỉnh sửa!

---

## 📊 XEM TỔNG KẾT

### Tổng Kết Cá Nhân
Ngay phía trên bảng tổng hợp, bạn sẽ thấy 3 ô:
- **Tổng cộng Trong giờ**: Tổng số giờ làm việc bình thường
- **Tổng cộng Ngoài giờ (x Hệ số)**: Tổng giờ ngoài giờ đã nhân hệ số
- **TỔNG CỘNG THỰC NHẬN**: Tổng số giờ cuối cùng

### Bảng Tổng Hợp Toàn Khoa
- Kéo xuống dưới cùng để xem **"DANH SÁCH NHÂN VIÊN KHOA PHẪU THUẬT - GMHS"**
- Bạn có thể xem tổng giờ của đồng nghiệp (nhưng **không sửa được**)

---

## 🔍 XEM DỮ LIỆU ĐỒNG NGHIỆP

1. Trong ô **"HỌ VÀ TÊN"**, bắt đầu gõ tên đồng nghiệp
2. Chọn tên từ danh sách gợi ý
3. Dữ liệu của họ sẽ hiển thị
4. **Các ô sẽ bị khóa màu xám** (chỉ xem, không sửa được)

---

## 🖨️ XUẤT VÀ IN

### Xuất Excel
- Nhấn nút **"Xuất Excel"**
- File Excel sẽ tự động tải về máy
- Tên file: `Bang_Cham_Cong_[TÊN]_[THÁNG].xls`

### In Báo Cáo
- Nhấn nút **"In báo cáo"**
- Chọn máy in hoặc lưu PDF

---

## 🚪 ĐĂNG XUẤT

- Nhấn nút **"Đăng xuất"** ở góc phải trên
- Xác nhận đăng xuất
- Hệ thống sẽ yêu cầu đăng nhập lại

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Hệ Số Ngoài Giờ
Hệ thống tự động tính hệ số cho **ĐIỀU DƯỠNG DỤNG CỤ** và **KTV GÂY MÊ**:
- Ngày thường: x1.5
- Chủ nhật: x2
- Ngày lễ: x2 hoặc x3 (tùy ngày)

### Phiên Đăng Nhập
- Phiên đăng nhập tự động hết khi **đóng trình duyệt**
- Mở lại phải đăng nhập lại

### Xóa Dữ Liệu
- Nút **"Xóa hết"**: Xóa toàn bộ dữ liệu của bạn trong tháng hiện tại
- **Cẩn thận**: Không thể khôi phục sau khi xóa!

---

## 🆘 KHẮC PHỤC SỰ CỐ

### Quên Mật Khẩu
- Mật khẩu mặc định: `123456`
- Nếu vẫn không vào được, liên hệ admin

### Không Đăng Nhập Được
- Kiểm tra tên phải viết **HOA** và **có dấu**
- Đảm bảo không có dấu cách thừa
- Thử xóa cache trình duyệt và reload

### Bị Khóa Không Sửa Được
- Kiểm tra bạn đã chọn đúng tên của mình chưa
- Nếu chọn tên người khác, các ô sẽ bị khóa (đúng như thiết kế)

### Dữ Liệu Không Lưu
- Đảm bảo đã nhấn nút **"Lưu dữ liệu"**
- Kiểm tra kết nối internet (nếu dùng online)
- Thử reload lại trang

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, liên hệ:
- **Admin**: Tân Nguyễn
- **Điện thoại**: 036.728.7102

---

## 📝 MẸO NHẬP LIỆU NHANH

1. **Dùng Tab**: Nhấn Tab để chuyển nhanh giữa các ô
2. **Nhập khoảng thời gian**: Thay vì tính số giờ, nhập `17H-21H` cho nhanh
3. **Lưu thường xuyên**: Nhấn Ctrl+S hoặc nút "Lưu dữ liệu" sau mỗi vài ngày nhập
4. **Kiểm tra tổng kết**: Xem 3 ô tổng kết phía trên để đảm bảo dữ liệu đúng

---

**Chúc bạn sử dụng hiệu quả! 🎉**
