import React from 'react';
import { MessageCircle, Calendar, FileText, Edit, Settings } from 'lucide-react';

const navItems = [
  { id: 'questions', label: 'Câu hỏi', icon: MessageCircle },
  { id: 'schedules', label: 'Lịch tư vấn', icon: Calendar },
  { id: 'examinations', label: 'Dịch vụ xét nghiệm', icon: FileText },
  { id: 'blogs', label: 'Quản lý blog', icon: Edit },
  { id: 'services', label: 'Quản lý dịch vụ', icon: Settings }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
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
  );
} 