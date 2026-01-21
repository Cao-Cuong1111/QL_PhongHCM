# Hướng dẫn cho GitHub Copilot

## Ngôn ngữ và Giao tiếp
- **Ngôn ngữ chính**: Tiếng Việt. Hãy trả lời câu hỏi và viết tài liệu bằng tiếng Việt.
- **Comment code**: Sử dụng tiếng Việt để giải thích các đoạn logic phức tạp.
- **Tên biến/Hàm**: Sử dụng tiếng Anh chuẩn (CamelCase hoặc snake_case tùy theo ngôn ngữ lập trình) để giữ code chuyên nghiệp.

## Nguyên tắc Lập trình (General Rules)
- **Clean Code**: Code phải rõ ràng, dễ đọc, dễ bảo trì.
- **DRY (Don't Repeat Yourself)**: Tránh lặp lại code, tách hàm khi cần thiết.
- **Xử lý lỗi**: Luôn kiểm tra và xử lý các trường hợp ngoại lệ (Exceptions), đặc biệt là với Database và I/O.

## Bối cảnh Dự án: QL_PhongHCM
- Đây là dự án Quản lý Phòng (có thể là phòng trọ, khách sạn, hoặc hội nghị tại HCM).
- Ưu tiên các giải pháp đơn giản, hiệu quả.

## Yêu cầu Bảo mật
- Không bao giờ hardcode mật khẩu, chuỗi kết nối (connection string) hoặc API Key trực tiếp vào code. Sử dụng biến môi trường hoặc file cấu hình.
