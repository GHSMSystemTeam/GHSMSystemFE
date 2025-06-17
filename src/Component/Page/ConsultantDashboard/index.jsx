import React, { useState } from 'react';
import Sidebar from './Sidebar';
import QuestionsPanel from './QuestionsPanel';
import SchedulesPanel from './SchedulesPanel';
import ExaminationsPanel from './ExaminationsPanel';
import BlogsPanel from './BlogsPanel';
import ServicesPanel from './ServicesPanel';

export default function ConsultantDashboard() {
  const [activeTab, setActiveTab] = useState('questions');

  const renderContent = () => {
    switch(activeTab) {
      case 'questions': return <QuestionsPanel />;
      case 'schedules': return <SchedulesPanel />;
      case 'examinations': return <ExaminationsPanel />;
      case 'blogs': return <BlogsPanel />;
      case 'services': return <ServicesPanel />;
      default: return <QuestionsPanel />;
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