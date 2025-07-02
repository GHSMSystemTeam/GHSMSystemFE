import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import QuestionsPanel from './QuestionsPanel';
import SchedulesPanel from './SchedulesPanel';
import ConsultingPanel from './ConsultingPanel';
import BlogsPanel from './BlogsPanel';
import { useAuth } from '../../Auth/AuthContext';
import ConsultantProfile from './ConsultantProfile';
import api from '../../config/axios';

export default function ConsultantDashboard() {
  const [activeTab, setActiveTab] = useState('questions');
  // State cho dữ liệu
  const [questions, setQuestions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [examBookings, setExamBookings] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  // State cho loading và error
  const [loading, setLoading] = useState({
    questions: false,
    bookings: false,
    examBookings: false,
    examResults: false,
    blogs: false,
    services: false,
  });
  const [error, setError] = useState({
    questions: null,
    bookings: null,
    examBookings: null,
    examResults: null,
    blogs: null,
    services: null,
  });  // State cho modal
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { user } = useAuth();
  const [openProfile, setOpenProfile] = useState(false); useEffect(() => {
    if (user && user.id) {
      fetchConsultationBookings(); // Fetch consultation bookings for "Lịch tư vấn"
      fetchTestingBookings(); // Fetch testing bookings for "Dịch vụ xét nghiệm"
      fetchExaminationResults(); // Fetch examination results for "Kết quả xét nghiệm"
    }
  }, [user]);

  useEffect(() => {
    fetchQuestions(); // <-- Thêm dòng này để luôn lấy câu hỏi khi vào trang
  }, []); const fetchConsultationBookings = async () => {
    setLoading((prev) => ({ ...prev, bookings: true }));
    setError((prev) => ({ ...prev, bookings: null }));
    try {
      // Giả sử service type ID của "Tư vấn" là 2, bạn có thể thay đổi theo API thực tế
      const res = await api.get('/api/servicebookings/servicetype/2');
      setBookings(res.data);
    } catch (err) {
      setError((prev) => ({ ...prev, bookings: 'Không thể tải danh sách lịch tư vấn.' }));
    } finally {
      setLoading((prev) => ({ ...prev, bookings: false }));
    }
  };

  // Hàm fetch testing bookings với service type id = 1
  const fetchTestingBookings = async () => {
    setLoading((prev) => ({ ...prev, examBookings: true }));
    setError((prev) => ({ ...prev, examBookings: null }));
    try {
      const res = await api.get('/api/servicebookings/servicetype/1');
      setExamBookings(res.data);
    } catch (err) {
      setError((prev) => ({ ...prev, examBookings: 'Không thể tải danh sách lịch xét nghiệm.' }));
    } finally {
      setLoading((prev) => ({ ...prev, examBookings: false }));
    }
  };

  // Hàm fetch examination results
  const fetchExaminationResults = async () => {
    setLoading((prev) => ({ ...prev, examResults: true }));
    setError((prev) => ({ ...prev, examResults: null }));
    try {
      // Giả sử API endpoint để lấy kết quả xét nghiệm
      const res = await api.get('/api/results');
      setExamResults(res.data);
    } catch (err) {
      setError((prev) => ({ ...prev, examResults: 'Không thể tải danh sách kết quả xét nghiệm.' }));
    } finally {
      setLoading((prev) => ({ ...prev, examResults: false }));
    }
  };  // Hàm cập nhật trạng thái consultation booking
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      // Cập nhật state local cho consultation bookings
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      return true;
    } catch (err) {
      console.error('Error updating consultation booking status:', err);
      return false;
    }
  };

  // Hàm cập nhật trạng thái exam booking
  const updateExamBookingStatus = async (bookingId, newStatus) => {
    try {
      // Cập nhật state local cho exam bookings
      setExamBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      return true;
    } catch (err) {
      console.error('Error updating exam booking status:', err);
      return false;
    }
  };

  const fetchQuestions = async () => {
    setLoading((prev) => ({ ...prev, questions: true }));
    setError((prev) => ({ ...prev, questions: null }));
    try {
      const response = await api.get('/api/question/active');
      // Chuyển đổi định dạng dữ liệu từ API
      const formattedQuestions = response.data.map(q => ({
        id: q.id,
        userId: q.customer?.id || q.customerId,
        userName: q.customer?.name || "Người dùng ẩn danh",
        title: q.title,
        content: q.content,
        date: q.createDate,
        tags: q.tags || [],
        views: q.views || 0,
        likes: q.likes || 0,
        status: q.answers && q.answers.length > 0 ? 'Đã trả lời' : 'Chưa trả lời',
        answers: q.answers?.map(a => ({
          id: a.id,
          doctorId: a.user?.id,
          doctorName: a.user?.name || "Bác sĩ",
          content: a.answerContent,
          date: a.createDate,
          likes: a.rating || 0
        })) || []
      }));
      setQuestions(formattedQuestions);
    } catch (err) {
      setError((prev) => ({ ...prev, questions: 'Không thể tải danh sách câu hỏi.' }));
    } finally {
      setLoading((prev) => ({ ...prev, questions: false }));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'questions':
        return (
          <QuestionsPanel
            questions={questions}
            loading={loading.questions}
            error={error.questions}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            fetchQuestions={fetchQuestions} // Đảm bảo truyền hàm này
          />
        );
      case 'consulting':
        return (
          <ConsultingPanel
            bookings={bookings}
            loading={loading.bookings}
            error={error.bookings}
            updateBookingStatus={updateBookingStatus}
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
          />
        );
      case 'blogs':
        return (
          <BlogsPanel
            blogs={blogs}
            loading={loading.blogs}
            error={error.blogs}
          />
        );
      case 'examinationResults':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Kết quả xét nghiệm</h2>
            <div className="text-center py-8 text-gray-500">
              <p>Chức năng đang được phát triển.</p>
              <p className="text-sm mt-2">Vui lòng sử dụng trang Staff Management để quản lý kết quả xét nghiệm.</p>
            </div>
          </div>
        );
      default:
        return <QuestionsPanel
          questions={questions}
          loading={loading.questions}
          error={error.questions}
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 bg-gradient-to-r from-purple-100">
        {renderContent()}
      </main>
    </div>
  );
}