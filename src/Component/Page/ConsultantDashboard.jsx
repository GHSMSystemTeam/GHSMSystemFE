import React, { useState } from 'react';
import { MessageCircle, Calendar, FileText, Stethoscope, Settings, Search, Plus, Eye, Reply, Edit, Trash2, Filter } from 'lucide-react';

export default function ConsultantDashboard() {
  const [activeTab, setActiveTab] = useState('questions');
  const [examTab, setExamTab] = useState('bookings');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock data
  const questions = [
    { id: 1, user: 'Nguyễn Thị A', question: 'Tôi muốn hỏi về chu kỳ kinh nguyệt không đều...', time: '2 giờ trước', status: 'Chưa trả lời' },
    { id: 2, user: 'Trần Văn B', question: 'Kết quả xét nghiệm HIV có chính xác không?', time: '5 giờ trước', status: 'Đã trả lời' },
    { id: 3, user: 'Lê Thị C', question: 'Thuốc tránh thai có tác dụng phụ gì không?', time: '1 ngày trước', status: 'Chưa trả lời' }
  ];

  const appointments = [
    { id: 1, user: 'Phạm Thị D', date: '2024-06-15', time: '09:00', service: 'Tư vấn sức khỏe sinh sản', status: 'Đã xác nhận' },
    { id: 2, user: 'Hoàng Văn E', date: '2024-06-15', time: '14:30', service: 'Tư vấn STIs', status: 'Chờ xác nhận' },
    { id: 3, user: 'Võ Thị F', date: '2024-06-16', time: '10:00', service: 'Tư vấn kế hoạch hóa gia đình', status: 'Đã xác nhận' }
  ];

  const examBookings = [
    { id: 1, user: 'Nguyễn Văn G', service: 'Xét nghiệm HIV', date: '2024-06-14', status: 'Đã lấy mẫu' },
    { id: 2, user: 'Trần Thị H', service: 'Xét nghiệm Giang mai', date: '2024-06-15', status: 'Chờ lấy mẫu' }
  ];

  const examResults = [
    { id: 1, user: 'Lê Văn I', service: 'Xét nghiệm HIV', date: '2024-06-10', status: 'Cần trả kết quả' },
    { id: 2, user: 'Phạm Thị J', service: 'Xét nghiệm HPV', date: '2024-06-12', status: 'Đã trả kết quả' }
  ];

  const blogs = [
    { id: 1, title: 'Giáo dục giới tính cho thanh thiếu niên', category: 'Giáo dục', views: 1250, comments: 23, date: '2024-06-10' },
    { id: 2, title: 'Cách phòng ngừa các bệnh lây truyền qua đường tình dục', category: 'Phòng ngừa', views: 890, comments: 15, date: '2024-06-08' },
    { id: 3, title: 'Tầm quan trọng của khám sức khỏe định kỳ', category: 'Sức khỏe', views: 670, comments: 8, date: '2024-06-05' }
  ];

  const services = [
    { id: 1, name: 'Xét nghiệm HIV', price: '200.000 VNĐ', description: 'Xét nghiệm phát hiện virus HIV' },
    { id: 2, name: 'Xét nghiệm Giang mai', price: '150.000 VNĐ', description: 'Xét nghiệm phát hiện vi khuẩn gây bệnh giang mai' },
    { id: 3, name: 'Tư vấn kế hoạch hóa gia đình', price: '100.000 VNĐ', description: 'Tư vấn về các phương pháp tránh thai' }
  ];

  const navItems = [
    { id: 'questions', label: 'Câu hỏi', icon: MessageCircle },
    { id: 'schedules', label: 'Lịch tư vấn', icon: Calendar },
    { id: 'examinations', label: 'Dịch vụ xét nghiệm', icon: FileText },
    { id: 'blogs', label: 'Quản lý blog', icon: Edit },
    { id: 'services', label: 'Quản lý dịch vụ', icon: Settings }
  ];

  const renderQuestions = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Câu hỏi từ khách hàng</h2>
      </div>
      <div className="bg-white rounded-lg shadow">
        {questions.map((q) => (
          <div key={q.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{q.user}</span>
                  <span className="text-sm text-gray-500">{q.time}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    q.status === 'Chưa trả lời' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {q.status}
                  </span>
                </div>
                <p className="text-gray-700">{q.question}</p>
              </div>
              <button 
                onClick={() => setSelectedQuestion(q)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Reply size={16} />
                Trả lời
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold mb-4">Trả lời câu hỏi</h3>
            <p className="text-sm text-gray-600 mb-2">Từ: {selectedQuestion.user}</p>
            <p className="mb-4">{selectedQuestion.question}</p>
            <textarea 
              className="w-full border rounded p-2 mb-4" 
              rows="4" 
              placeholder="Nhập câu trả lời..."
            ></textarea>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Gửi trả lời
              </button>
              <button 
                onClick={() => setSelectedQuestion(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSchedules = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lịch tư vấn</h2>
      </div>
      <div className="bg-white rounded-lg shadow">
        {appointments.map((apt) => (
          <div key={apt.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{apt.user}</h3>
                <p className="text-sm text-gray-600">{apt.service}</p>
                <p className="text-sm text-gray-500">{apt.date} - {apt.time}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                  apt.status === 'Đã xác nhận' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {apt.status}
                </span>
              </div>
              <button 
                onClick={() => setSelectedAppointment(apt)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Eye size={16} />
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold mb-4">Thông tin chi tiết</h3>
            <div className="space-y-2">
              <p><strong>Khách hàng:</strong> {selectedAppointment.user}</p>
              <p><strong>Dịch vụ:</strong> {selectedAppointment.service}</p>
              <p><strong>Ngày:</strong> {selectedAppointment.date}</p>
              <p><strong>Giờ:</strong> {selectedAppointment.time}</p>
              <p><strong>Trạng thái:</strong> {selectedAppointment.status}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Xác nhận
              </button>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderExaminations = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dịch vụ xét nghiệm</h2>
      </div>
      
      <div className="mb-4">
        <div className="flex border-b">
          <button
            onClick={() => setExamTab('bookings')}
            className={`px-4 py-2 ${examTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Lịch đặt xét nghiệm
          </button>
          <button
            onClick={() => setExamTab('results')}
            className={`px-4 py-2 ${examTab === 'results' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Trả kết quả xét nghiệm
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {examTab === 'bookings' && examBookings.map((booking) => (
          <div key={booking.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{booking.user}</h3>
                <p className="text-sm text-gray-600">{booking.service}</p>
                <p className="text-sm text-gray-500">Ngày đặt: {booking.date}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                  booking.status === 'Đã lấy mẫu' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Cập nhật trạng thái
              </button>
            </div>
          </div>
        ))}

        {examTab === 'results' && examResults.map((result) => (
          <div key={result.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{result.user}</h3>
                <p className="text-sm text-gray-600">{result.service}</p>
                <p className="text-sm text-gray-500">Ngày xét nghiệm: {result.date}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                  result.status === 'Đã trả kết quả' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Tải file kết quả
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Gửi kết quả
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBlogs = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý blog</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Plus size={16} />
          Tạo bài viết mới
        </button>
      </div>
      
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <select className="border rounded px-3 py-2">
            <option>Tất cả danh mục</option>
            <option>Giáo dục</option>
            <option>Phòng ngừa</option>
            <option>Sức khỏe</option>
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết..." 
            className="border rounded px-3 py-2 flex-1"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {blogs.map((blog) => (
          <div key={blog.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium mb-2">{blog.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Danh mục: {blog.category}</span>
                  <span>{blog.views} lượt xem</span>
                  <span>{blog.comments} bình luận</span>
                  <span>{blog.date}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                  Xem bình luận
                </button>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  <Edit size={14} />
                </button>
                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServices = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý dịch vụ</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {services.map((service) => (
          <div key={service.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
                <p className="text-lg font-bold text-blue-600 mt-1">{service.price}</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                <Edit size={16} />
                Chỉnh sửa
              </button>
            </div>
          </div>
        ))}
        
        <div className="p-4 text-center">
          <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 flex items-center gap-2 mx-auto">
            <Plus size={16} />
            Thêm dịch vụ mới
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'questions': return renderQuestions();
      case 'schedules': return renderSchedules();
      case 'examinations': return renderExaminations();
      case 'blogs': return renderBlogs();
      case 'services': return renderServices();
      default: return renderQuestions();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-blue-700 text-white py-6 px-4">
        <h1 className="text-xl font-bold mb-6">Bảng điều khiển</h1>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-blue-600 transition ${
                  activeTab === item.id ? 'bg-blue-600 font-semibold' : ''
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
}