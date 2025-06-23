import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import QuestionsPanel from './QuestionsPanel';
import SchedulesPanel from './SchedulesPanel';
import ExaminationsPanel from './ExaminationsPanel';
import BlogsPanel from './BlogsPanel';
import ServicesPanel from './ServicesPanel';
import { useAuth } from '../../Auth/AuthContext';
import ConsultantProfile from './ConsultantProfile';

export default function ConsultantDashboard() {
  const [activeTab, setActiveTab] = useState('questions');
  // State cho dữ liệu
  const [questions, setQuestions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [examBookings, setExamBookings] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  // State cho loading và error
  const [loading, setLoading] = useState({
    questions: false,
    appointments: false,
    examBookings: false,
    examResults: false,
    blogs: false,
    services: false,
  });
  const [error, setError] = useState({
    questions: null,
    appointments: null,
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
    console.log('ConsultantDashboard mounted');
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'questions':
        return (
          <QuestionsPanel
            questions={questions}
            loading={loading.questions}
            error={error.questions}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
          />
        );
      case 'schedules':
        return (
          <SchedulesPanel
            appointments={appointments}
            loading={loading.appointments}
            error={error.appointments}
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