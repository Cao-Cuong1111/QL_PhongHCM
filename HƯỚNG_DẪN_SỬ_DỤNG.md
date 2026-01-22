# HƯỚNG DẪN SỬ DỤNG PHẦN MỀM QUẢN LÝ PHÒNG HỒ CHÍ MINH

Chào mừng bạn đến với phần mềm Quản lý Phòng Hồ Chí Minh. Tài liệu này sẽ hướng dẫn bạn từ lúc bắt đầu cài đặt đến khi sử dụng thành thạo các tính năng.

---

## 1. Cài đặt ban đầu (Dành cho máy mới)

Để chạy được phần mềm, máy tính của bạn cần cài đặt **Node.js**.

1. **Tải Node.js**: Truy cập [nodejs.org](https://nodejs.org/) và tải phiên bản **LTS** (khuyên dùng).
2. **Cài đặt**: Chạy file vừa tải về và nhấn "Next" cho đến khi hoàn tất.
3. **Chuẩn bị file**: Copy toàn bộ thư mục phần mềm `DA_PhongHCM` vào ổ đĩa bất kỳ (ví dụ: ổ `D:`).

---

## 2. Khởi động phần mềm

1. Vào thư mục gốc của phần mềm.
2. Tìm và nhấn đúp chuột vào file **`CHAY_PHAN_MEM.bat`**.
3. Một cửa sổ màu đen hiện ra. Đợi vài giây cho đến khi thấy dòng chữ: `🚀 Server is running on http://localhost:3000`.
4. Mở trình duyệt Web (Chrome, Cốc Cốc, Edge) và gõ địa chỉ: **`http://localhost:3000`**.

---

## 3. Đăng nhập hệ thống

- **Tài khoản mặc định**: `admin`
- **Mật khẩu mặc định**: `123456`
- **Lưu ý**: Sau khi đăng nhập thành công, bạn nên vào mục "Quản lý Người dùng" để đổi mật khẩu.

---

## 4. Các module chức năng chính

### 4.1. Quản lý Sách & Tài liệu
- **Xem danh sách**: Xem tất cả tài liệu hiện có, tìm kiếm theo tên hoặc mã.
- **Thêm mới**: Nhập thông tin tài liệu. Bạn có thể nhấn nút **"📷 Quét mã"** để dùng webcam quét mã vạch/QR có sẵn trên sách để điền nhanh Mã sách.
- **In mã QR**: Mỗi cuốn sách sau khi lưu sẽ có một mã QR riêng. Bạn có thể nhấn **"In nhãn"** để in ra và dán lên gáy sách.

### 4.2. Mượn & Trả sách
- **Đăng ký mượn**: Chọn người mượn và sách.
- **Mẹo**: Nhấn nút **"📷 Quét mã QR"** bên cạnh ô chọn sách để dùng webcam quét mã QR trên gáy sách. Hệ thống sẽ tự động chọn đúng cuốn sách đó.
- **Trả sách**: Nhấn nút "Trả sách" trong danh sách mượn để hoàn tất.

### 4.3. Quản lý Vật chất & Thiết bị
- Quản lý các tài sản khác trong phòng như: Ti vi, Loa máy, Bàn ghế, Tranh ảnh...
- Theo dõi tình trạng (Tốt, Hỏng, Cần sửa chữa).

### 4.4. Lịch chương trình & Hoạt động
- **Lịch tuần/tháng**: Lập kế hoạch hoạt động của đơn vị.
- **Truyền thanh nội bộ**: Quản lý các bản tin và lịch phát thanh tự động.

---

## 5. Hướng dẫn sử dụng QR Code (Tính năng đặc biệt)

Phần mềm tích hợp công nghệ QR Code để giúp việc quản lý chuyên nghiệp và nhanh chóng hơn:

1. **Khi quét mã**: Nếu trình duyệt hỏi "Cho phép truy cập Camera", hãy nhấn **"Cho phép" (Allow)**.
2. **Bật Camera**: Nếu khung hình bị đen, hãy nhấn nút **"Bật Camera Ngay"** trong cửa sổ quét.
3. **Căn chỉnh**: Đưa mã QR vào giữa khung ngắm (vùng có viền vàng/trắng) cho đến khi hệ thống báo thành công.

---

## 6. Sao lưu dữ liệu

Dữ liệu của bạn được lưu trong file: `server/database/QL_PhongHCM.db`.
- **Hàng tuần**: Bạn nên copy file này lưu ra ổ cứng ngoài hoặc USB để đề phòng máy tính gặp sự cố.

---
**Chúc bạn sử dụng phần mềm hiệu quả!**
