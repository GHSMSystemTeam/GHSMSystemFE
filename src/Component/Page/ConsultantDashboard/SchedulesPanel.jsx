import React, { useState } from 'react';
import { Eye } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 0, label: 'Created' },
  { value: 1, label: 'Pending' },
  { value: 2, label: 'Finished' },
  { value: 3, label: 'Canceled' },
];

function getGenderText(gender) {
  if (gender === 0) return 'Nam';
  if (gender === 1) return 'Nữ';
  return 'Khác';
}

import api from '../../config/axios';

export default function SchedulesPanel({ bookings, loading, error, updateBookingStatus, selectedAppointment, setSelectedAppointment }) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (id, statusNumber) => {
    setUpdatingId(id);
    try {
      const res =await api.put(`/api/servicebookings/status/${id}/${statusNumber}`);
      console.log('Cập nhật trạng thái thành công:', res.data);
      // Cập nhật lại trạng thái trong UI
      if (typeof updateBookingStatus === 'function') {
        await updateBookingStatus(id, statusNumber);
      }
      alert('Cập nhật trạng thái thành công!');
    } catch (err) {
      console.error('Cập nhật trạng thái thất bại:', err);
      alert('Cập nhật trạng thái thất bại!');
    }
    setUpdatingId(null);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 0: return 'text-gray-500'; // Created
      case 1: return 'text-yellow-500'; // Pending
      case 2: return 'text-green-500'; // Finished
      case 3: return 'text-red-500'; // Canceled
      default: return 'text-gray-500';
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lịch đặt dịch vụ</h2>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-5 font-semibold border-b p-4 bg-gray-50">
            <div>Họ tên</div>
            <div>Giới tính</div>
            <div>Ngày hẹn</div>
            <div>Dịch vụ</div>
            <div>Trạng thái</div>
          </div>
          {bookings.map((booking) => (
            <div key={booking.id} className="grid grid-cols-5 items-center p-4 border-b last:border-b-0">
              <div>{booking.customerId?.name}</div>
              <div>{getGenderText(booking.customerId?.gender)}</div>
              <div>{booking.appointmentDate?.slice(0, 10)}</div>
              <div>{booking.serviceTypeId?.name}</div>
              <div>
                <select
                  className="border rounded px-2 py-1"
                  value={booking.status}
                  disabled={updatingId === booking.id}
                  onChange={e => handleStatusChange(booking.id, Number(e.target.value))}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
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
              <p><strong>Khách hàng:</strong> {selectedAppointment.customerId?.name}</p>
              <p><strong>Giới tính:</strong> {getGenderText(selectedAppointment.customerId?.gender)}</p>
              <p><strong>Dịch vụ:</strong> {selectedAppointment.serviceTypeId?.name}</p>
              <p><strong>Ngày:</strong> {selectedAppointment.appointmentDate?.slice(0, 10)}</p>
              <p><strong>Trạng thái:</strong> {STATUS_OPTIONS.find(opt => opt.value === selectedAppointment.status)?.label}</p>
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