# Staff Management System

Hệ thống quản lý dành cho nhân viên xét nghiệm của trung tâm y tế.

## Cấu trúc thư mục

```
StaffManagement/
├── StaffProfile.jsx              # Component chính
├── StaffSidebar.jsx             # Thanh điều hướng
├── ExaminationSchedulePanel.jsx  # Quản lý lịch xét nghiệm
├── ExaminationResultPanel.jsx    # Quản lý kết quả xét nghiệm
└── index.jsx                     # Export tất cả components
```

## Chức năng chính

### 1. Quản lý lịch xét nghiệm (ExaminationSchedulePanel)

- Xem danh sách tất cả lịch hẹn xét nghiệm
- Tìm kiếm theo tên, email, số điện thoại
- Lọc theo trạng thái và ngày hẹn
- Cập nhật trạng thái lịch hẹn (xác nhận, hoàn thành, hủy)
- Xem chi tiết thông tin bệnh nhân

### 2. Quản lý kết quả xét nghiệm (ExaminationResultPanel)

- Nhập kết quả xét nghiệm cho các ca đã hoàn thành
- Upload file đính kèm (PDF, hình ảnh, tài liệu)
- Gửi kết quả cho bệnh nhân qua email
- Tải xuống báo cáo kết quả
- Theo dõi trạng thái kết quả (chờ, có kết quả, đã gửi)

### 3. Thống kê và báo cáo

- Thống kê số lượng xét nghiệm theo trạng thái
- Báo cáo hiệu suất công việc
- Xuất báo cáo chi tiết theo thời gian
- Theo dõi tiến độ xử lý

## API Endpoints cần thiết

```javascript
// Lịch hẹn xét nghiệm
GET    /api/exam-bookings                    # Lấy danh sách lịch hẹn
PUT    /api/exam-bookings/:id/status         # Cập nhật trạng thái

// Kết quả xét nghiệm
GET    /api/exam-bookings/completed          # Lấy danh sách đã hoàn thành
POST   /api/exam-results                     # Lưu kết quả
POST   /api/exam-results/upload              # Upload file
POST   /api/exam-results/:id/send            # Gửi kết quả
GET    /api/exam-results/:id/download        # Tải xuống
```

## Cách sử dụng

### Import components:

```javascript
import {
  StaffProfile,
  ExaminationSchedulePanel,
  ExaminationResultPanel,
} from "./Component/Page/StaffManagement";
```

### Sử dụng component chính:

```javascript
function App() {
  return (
    <Routes>
      <Route path="/staff" element={<StaffProfile />} />
    </Routes>
  );
}
```

## Dependencies

- React Icons: lucide-react
- HTTP Client: axios (đã có sẵn)
- Toast notifications: react-toastify hoặc custom Toast
- Authentication: AuthContext (đã có sẵn)

## Features chính

1. **Responsive Design**: Tương thích với mọi kích thước màn hình
2. **Real-time Updates**: Cập nhật dữ liệu theo thời gian thực
3. **Search & Filter**: Tìm kiếm và lọc dữ liệu linh hoạt
4. **File Upload**: Hỗ trợ upload nhiều loại file
5. **Export/Download**: Xuất báo cáo và kết quả
6. **Data Validation**: Kiểm tra dữ liệu đầu vào
7. **Loading States**: Hiển thị trạng thái loading
8. **Error Handling**: Xử lý lỗi một cách thân thiện

## Customization

Các component được thiết kế để dễ dàng tùy chỉnh:

- Thay đổi màu sắc thông qua Tailwind CSS classes
- Thêm/xóa trường dữ liệu trong forms
- Tùy chỉnh layout và giao diện
- Thêm validation rules mới
- Mở rộng chức năng báo cáo

## Security

- Xác thực người dùng qua AuthContext
- Kiểm tra quyền truy cập từng chức năng
- Validation dữ liệu phía client và server
- Bảo mật upload file
- Mã hóa thông tin nhạy cảm
