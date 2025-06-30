import React, { useState, useEffect } from 'react';
import { Calendar, FileText, User, Settings } from 'lucide-react';
import ExaminationSchedulePanel from './ExaminationSchedulePanel';
import ExaminationResultPanel from './ExaminationResultPanel';
import { useAuth } from '../../Auth/AuthContext';
import { useToast } from '../../Toast/ToastProvider';
import api from '../../config/axios';

export default function StaffProfile() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Fetch staff info
  useEffect(() => {
    if (user) {
      setStaffInfo({
        fullName: user.fullName || 'Nhân viên',
        email: user.email,
        role: 'Nhân viên xét nghiệm',
        department: 'Phòng xét nghiệm'
      });
    }
  }, [user]);

  const tabs = [
    {
      id: 'schedule',
      label: 'Quản lý lịch hẹn',
      icon: <Calendar size={20} />,
      description: 'Xem và quản lý lịch xét nghiệm'
    },
    {
      id: 'results',
      label: 'Kết quả xét nghiệm',
      icon: <FileText size={20} />,
      description: 'Nhập và quản lý kết quả xét nghiệm'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Xin chào, {staffInfo?.fullName}
                </h1>
                <p className="text-gray-600">
                  {staffInfo?.role} - {staffInfo?.department}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{staffInfo?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Description */}
        <div className="mb-6">
          <p className="text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Tab Panels */}
        {activeTab === 'schedule' && (
          <ExaminationSchedulePanel
            selectedAppointment={selectedAppointment}
            setSelectedAppointment={setSelectedAppointment}
          />
        )}

        {activeTab === 'results' && (
          <ExaminationResultPanel />
        )}
      </div>
    </div>
  );
}