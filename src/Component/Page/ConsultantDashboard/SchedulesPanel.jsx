import React from 'react';
import { Eye } from 'lucide-react';

export default function SchedulesPanel({ appointments, loading, error, selectedAppointment, setSelectedAppointment }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lịch tư vấn</h2>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
      )}
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
} 