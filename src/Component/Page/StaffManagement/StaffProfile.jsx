import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, FileText, User } from 'lucide-react';
import ExaminationSchedulePanel from './ExaminationSchedulePanel';
import ExaminationResultPanel from './ExaminationResultPanel';
import { useAuth } from '../../Auth/AuthContext';
import { useToast } from '../../Toast/ToastProvider';
import api from '../../config/axios';

export default function StaffProfile() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Fetch staff info
  useEffect(() => {
    if (user) {
      setStaffInfo({
        fullName: user.fullName || 'Nhân viên xét nghiệm',
        email: user.email,
        role: 'Nhân viên xét nghiệm',
        department: 'Phòng xét nghiệm'
      });
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Purple theme like in the image */}
      <div className="w-64 bg-gradient-to-b from-purple-600 to-purple-800 text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-purple-500">
          <h1 className="text-xl font-bold">Bảng điều khiển</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-purple-100 hover:bg-purple-700'
                }`}
              >
                <BarChart3 className="mr-3" size={20} />
                Bảng điều khiển
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                  activeTab === 'schedule' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-purple-100 hover:bg-purple-700'
                }`}
              >
                <Calendar className="mr-3" size={20} />
                Lịch xét nghiệm
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('results')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center ${
                  activeTab === 'results' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-purple-100 hover:bg-purple-700'
                }`}
              >
                <FileText className="mr-3" size={20} />
                Kết quả xét nghiệm
              </button>
            </li>
          </ul>
        </nav>

        {/* User Info at Bottom */}
        <div className="p-4 border-t border-purple-500">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="ml-3">
              <p className="font-medium">{staffInfo?.fullName}</p>
              <p className="text-purple-200 text-sm">{staffInfo?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Content Header */}
        <div className="bg-white border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'schedule' && 'Lịch xét nghiệm'}
            {activeTab === 'results' && 'Kết quả xét nghiệm'}
            {activeTab === 'dashboard' && 'Bảng điều khiển'}
          </h2>
          <p className="text-gray-600 mt-1">
            {activeTab === 'schedule' && 'Quản lý lịch hẹn xét nghiệm'}
            {activeTab === 'results' && 'Nhập và gửi kết quả xét nghiệm'}
            {activeTab === 'dashboard' && 'Tổng quan hoạt động hệ thống'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'schedule' && (
            <ExaminationSchedulePanel
              selectedAppointment={selectedAppointment}
              setSelectedAppointment={setSelectedAppointment}
            />
          )}

          {activeTab === 'results' && (
            <ExaminationResultPanel />
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Tổng lịch hẹn</p>
                      <p className="text-3xl font-bold text-blue-600">24</p>
                    </div>
                    <Calendar className="text-blue-600" size={32} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Hôm nay</p>
                      <p className="text-3xl font-bold text-green-600">8</p>
                    </div>
                    <Calendar className="text-green-600" size={32} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Chờ kết quả</p>
                      <p className="text-3xl font-bold text-yellow-600">12</p>
                    </div>
                    <FileText className="text-yellow-600" size={32} />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Hoàn thành</p>
                      <p className="text-3xl font-bold text-purple-600">16</p>
                    </div>
                    <BarChart3 className="text-purple-600" size={32} />
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Chào mừng đến với hệ thống quản lý xét nghiệm GHSMS
                </h3>
                <p className="text-gray-600 mb-4">
                  Sử dụng menu bên trái để điều hướng giữa các chức năng:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-900">Lịch xét nghiệm</h4>
                      <p className="text-blue-700 text-sm">Xem, cập nhật trạng thái lịch hẹn xét nghiệm</p>
                    </div>
                  </div>
                  <div className="flex items-start p-4 bg-green-50 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-green-900">Kết quả xét nghiệm</h4>
                      <p className="text-green-700 text-sm">Nhập và gửi kết quả xét nghiệm cho bệnh nhân</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}