import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import QuestionsPanel from './QuestionsPanel';
import SchedulesPanel from './SchedulesPanel';
import ExaminationsPanel from './ExaminationsPanel';
import BlogsPanel from './BlogsPanel';
import ServicesPanel from './ServicesPanel';
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
  });
  // State cho modal
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  // State cho tab xét nghiệm
  const [examTab, setExamTab] = useState('bookings');
  const { user } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      fetchBookings(user.id);
    }
  }, [user]);

  useEffect(() => {
    fetchQuestions(); // <-- Thêm dòng này để luôn lấy câu hỏi khi vào trang
  }, []);

  const fetchBookings = async (consultantId) => {
    setLoading((prev) => ({ ...prev, bookings: true }));
    setError((prev) => ({ ...prev, bookings: null }));
    try {
      const res = await api.get(`/api/servicebookings/consultant/${consultantId}`);
      setBookings(res.data);
    } catch (err) {
      setError((prev) => ({ ...prev, bookings: 'Không thể tải danh sách lịch hẹn.' }));
    } finally {
      setLoading((prev) => ({ ...prev, bookings: false }));
    }
  };

  // Hàm cập nhật trạng thái booking
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      // API đã được gọi trong SchedulesPanel, không cần gọi lại ở đây
      // Chỉ cần cập nhật state local
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      return true;
    } catch (err) {
      console.error('Error updating booking status:', err);
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
      case 'schedules':
        return (
          <SchedulesPanel
            bookings={bookings}
            loading={loading.bookings}
            error={error.bookings}
            updateBookingStatus={updateBookingStatus}
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
          />
        );
      case 'examinations':
        return (
          <ExaminationsPanel
            examTab={examTab}
            setExamTab={setExamTab}
            examBookings={examBookings}
            examResults={examResults}
            loading={loading}
            error={error}
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
      case 'services':
        return (
          <ServicesPanel
            services={services}
            loading={loading.services}
            error={error.services}
          />
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
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
}