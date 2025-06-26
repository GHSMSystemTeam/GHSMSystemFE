import React, { useState } from 'react';
import { MessageCircle, Calendar, FileText, Edit, Settings } from 'lucide-react';
import { useAuth } from '../../Auth/AuthContext';
import ConsultantProfile from './ConsultantProfile';

const navItems = [
  { id: 'questions', label: 'Câu hỏi', icon: MessageCircle },
  { id: 'schedules', label: 'Lịch tư vấn', icon: Calendar },
  { id: 'examinations', label: 'Dịch vụ xét nghiệm', icon: FileText },
  { id: 'blogs', label: 'Quản lý blog', icon: Edit },
  { id: 'services', label: 'Quản lý dịch vụ', icon: Settings }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <aside className="w-64 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-4 flex flex-col h-screen">
      <h1 className="text-xl font-bold mb-6">Bảng điều khiển</h1>
      <nav className="space-y-2 flex-1">
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
      {/* Profile button at the bottom */}
      {user && (
        <button
          className="mt-6 flex items-center gap-3 px-4 py-3 rounded hover:bg-blue-600 transition bg-blue-800"
          onClick={() => setOpenProfile(true)}
        >
          <img
            src={user.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjE1IiBmaWxsPSIjOUI5QkExIi8+CjxwYXRoIGQ9Ik0yMCA3NkMyMCA2OC4yODQzIDI2LjI4NDMgNjIgMzQgNjJINjZDNzMuNzE1NyA2MiA4MCA2OC4yODQzIDgwIDc2VjEwMEgyMFY3NloiIGZpbGw9IiM5QjlCQTEiLz4KPC9zdmc+'}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <span className="font-medium">{user.fullName || user.name || user.email}</span>
        </button>
      )}
      <ConsultantProfile consultant={user || {}} open={openProfile} onClose={() => setOpenProfile(false)} />
    </aside>
  );
}