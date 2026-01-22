# Hướng dẫn cho GitHub Copilot

## Ngôn ngữ và Giao tiếp
- **Ngôn ngữ chính**: Tiếng Việt. Hãy trả lời câu hỏi và viết tài liệu bằng tiếng Việt.
- **Comment code**: Sử dụng tiếng Việt để giải thích các đoạn logic phức tạp.
- **Tên biến/Hàm**: Sử dụng tiếng Anh chuẩn (CamelCase hoặc snake_case tùy theo ngôn ngữ lập trình) để giữ code chuyên nghiệp.

## Nguyên tắc Lập trình (General Rules)
- **Clean Code**: Code phải rõ ràng, dễ đọc, dễ bảo trì.
- **DRY (Don't Repeat Yourself)**: Tránh lặp lại code, tách hàm khi cần thiết.
- **Xử lý lỗi**: Luôn kiểm tra và xử lý các trường hợp ngoại lệ (Exceptions), đặc biệt là với Database và I/O.

## Yêu cầu
ĐỀ TÀI
XÂY DỰNG PHẦN MỀM WEB APP QUẢN LÝ PHÒNG HỒ CHÍ MINH TRONG ĐƠN VỊ BỘ ĐỘI
## Lý do chọn đề tài
Phòng Hồ Chí Minh trong các đơn vị bộ đội là nơi diễn ra nhiều hoạt động chính trị – tư tưởng – văn hóa – giáo dục, bao gồm:
- Quản lý đăng ký sách, báo, tài liệu chính trị
- Quản lý mượn – trả sách báo
- Quản lý cơ sở vật chất (máy tính, bàn ghế, trang thiết bị)
- Đăng ký sử dụng phòng, đăng ký máy tính
- Lập và quản lý kế hoạch, lịch hoạt động tuần
Hiện nay, hầu hết các nghiệp vụ này vẫn được thực hiện bằng sổ sách giấy, dẫn đến:
- Khó tra cứu, thống kê
- Dễ sai sót, thất lạc
- Mất nhiều thời gian tổng hợp báo cáo
- Chưa đáp ứng yêu cầu chuyển đổi số trong quân đội
Vì vậy, việc xây dựng phần mềm Web App quản lý Phòng Hồ Chí Minh là cần thiết, góp phần:
- Chuẩn hóa quy trình nghiệp vụ
- Số hóa các mẫu sổ sách
- Nâng cao hiệu quả quản lý, chỉ huy
## Mục tiêu của hệ thống
## Mục tiêu tổng quát
Xây dựng hệ thống Web App giúp quản lý tập trung, thống nhất toàn bộ hoạt động của Phòng Hồ Chí Minh ở đơn vị, thay thế sổ sách thủ công bằng hệ thống số hóa.
## Mục tiêu cụ thể
- Quản lý đăng ký sách, báo, tài liệu
- Quản lý mượn – trả sách báo theo từng đơn vị, cá nhân.
- Quản lý vật chất, trang thiết bị
- Quản lý đăng ký sử dụng máy tính, phòng
- Quản lý lịch hoạt động theo tuần
- Thống kê, báo cáo theo mẫu biểu
## Phạm vi và đối tượng sử dụng
## Đối tượng sử dụng
- Admin (cán bộ phụ trách phòng Hồ Chí Minh)
- Cán bộ chính trị đơn vị.
## Phạm vi
- Sử dụng trong mạng nội bộ đơn vị (LAN)
- Triển khai dưới dạng Web App (truy cập bằng trình duyệt)
- Có thể mở rộng tích hợp trong tương lai
## Chức năng chính của hệ thống
## Quản lý người dùng
- Quản lý tài khoản (thêm/sửa/xóa)
- Phân quyền:
- Admin (quản lý toàn bộ hệ thống, thêm sửa xóa vật chất tài liệu có lưu trử lịch sử,… đăng ký tài khoản, thêm sửa xóa tài khoản, phê duyệt mượn trả,…, đăng ký bạn đọc, mượn trả)
- Người dùng (cán bộ đơn vị chỉ được đăng nhập, đăng xuất, đăng ký mượn trả tài liệu theo nhu cầu, tổng hợp báo cáo kết quả, tình trạng tài liệu, đăng ký sử dụng phòng HCM cho đơn vị,…
- Đăng nhập, đổi mật khẩu
## Quản lý sách – báo – tài liệu
(Số hóa sổ đăng ký sách báo)
- Thêm, sửa, xóa sách/báo
- Thông tin quản lý:
- Mã sách
- Tên sách/báo
- Loại (sách chính trị, báo, tạp chí…( mỗi loại có thể phân loại them chuyên mục con))
- Số lượng
- Năm xuất bản
- Tình trạng
- Tìm kiếm, lọc theo loại
## Quản lý mượn – trả sách báo
(Số hóa sổ mượn trả sách báo)
- Đăng ký mượn sách, đăng ký bạn đọc (nếu chiến sĩ đơn vị lên phòng HCM đăng ký)
- Ghi nhận:
- Người mượn
- Ngày mượn
- Ngày trả dự kiến
- Xác nhận trả sách
- Thống kê:
- Sách đang mượn
- Sách quá hạn
- Tình trạng hỏng hóc, mất mát
- Lịch sử mượn trả
## Quản lý vật chất Phòng Hồ Chí Minh
(Số hóa sổ quản lý vật chất)
- Quản lý danh mục vật chất:
- Máy tính
- Bàn ghế
- Máy chiếu
- Pano apphic
- Trang thiết bị khác
- Thông tin:
- Mã vật chất
- Tên
- Số lượng
- Tình trạng sử dụng
- Cập nhật hư hỏng, bảo dưỡng
## Đăng ký sử dụng máy tính
(Số hóa sổ đăng ký sử dụng máy tính)
- Người dùng đăng ký:
- Ngày sử dụng
- Ca sử dụng
- Mục đích
- Admin duyệt đăng ký
- Tránh trùng lịch sử dụng
## Đăng ký sử dụng phòng Hồ Chí Minh
(Số hóa sổ đăng ký sử dụng phòng Hồ Chí Minh)
- Đăng ký tổ chức:
- Sinh hoạt chính trị
- Học tập
- Hội họp
- Văn hóa văn nghệ
- Thông tin:
- Thời gian
- Đơn vị tổ chức
- Nội dung hoạt động
- Admin duyệt lịch
## Quản lý lịch hoạt động tuần
(Số hóa sổ kế hoạch tuần)
- Lập kế hoạch hoạt động theo tuần
- Phân loại hoạt động:
- Chính trị – tư tưởng
- Văn hóa – đọc sách
- In/xuất báo cáo kế hoạch
## Báo cáo – thống kê
- Thống kê:
- Sách báo
- Mượn trả
- Vật chất
- Lịch hoạt động
- Xuất báo cáo:
- Word/ Excel
- Phục vụ công tác chỉ huy
## Thiết kế hệ thống
## Kiến trúc tổng thể
Mô hình 3 tầng (MVC):
- Frontend: HTML, CSS, Bootstrap, JavaScript
- Backend: Node.js (Express.js)
- Database: Microsoft SQL Server
## Công nghệ sử dụng
Thành phần	Công nghệ
- Backend:	Node.js + Express
- Database:	SQL Server, code first
- ORM:	Sequelize
- Authentication:	JWT
- Frontend:	EJS / React (tùy mức độ)
- Báo cáo:	ExcelJS, PDFKit
## Thiết kế cơ sở dữ liệu (mô tả)
## Một số bảng chính:
- NguoiDung
- PhanQuyen
- TaiLieu
- MuonTra
- VatChat
- DangKySDMayTinh
- DangKySDPhongHCM
- LichHoatDong
CSDL thiết kế theo chuẩn hóa, dễ mở rộng.
## Thiết kế giao diện Admin
## Trang Admin Dashboard
- Tổng số sách
- Sách đang mượn
- Lịch hoạt động sắp tới
- Đăng ký chờ duyệt
## Các màn hình quản lý
- Quản lý người dùng
- Quản lý sách báo
- Quản lý mượn trả
- Quản lý vật chất
- Duyệt đăng ký
- Báo cáo – thống kê
## Phát triển
- Quét QR sách báo
- Đăng nhập thẻ quân nhân
- Thống kê bằng biểu đồ
- Kết nối nhiều đơn vị

