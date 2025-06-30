import React from 'react';
import { Calendar, FileText, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../Auth/AuthContext';

const menuItems = [
  {
    id: 'schedule',
    label: 'Quản lý lịch hẹn',
    icon: Calendar,
    description: 'Xem và quản lý lịch xét nghiệm'
  },
  {
    id: 'results',
    label: 'Kết quả xét nghiệm',
    icon: FileText,
    description: 'Nhập và quản lý kết quả'
  }
];

export default function StaffSidebar({ activeTab, setActiveTab, onLogout }) {
  const { user } = useAuth();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 h-fit">
      {/* User Info */}
      <div className="border-b pb-4 mb-6">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.fullName || 'Nhân viên'}
            </p>
            <p className="text-xs text-gray-500">Nhân viên xét nghiệm</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-8 pt-6 border-t space-y-2">
        <button
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
        >
          <Settings className="mr-3 h-5 w-5" />
          Cài đặt
        </button>
        
        
      </div>
    </div>
  );
}
