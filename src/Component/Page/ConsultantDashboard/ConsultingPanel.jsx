import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Clock, XCircle, Check, Video } from 'lucide-react';
import api from '../../config/axios';
import { useToast } from '../../Toast/ToastProvider';
import { useAuth } from '../../Auth/AuthContext';
import VideoCallManager from './VideoCallManager';
const STATUS_OPTIONS = [
  { value: 0, label: 'Chờ xác nhận', icon: <Clock size={14} className="mr-1 text-yellow-600" /> },
  { value: 1, label: 'Đã xác nhận', icon: <CheckCircle size={14} className="mr-1 text-green-600" /> },
  { value: 2, label: 'Hoàn thành', icon: <Check size={14} className="mr-1 text-blue-600" /> },
  { value: 3, label: 'Đã hủy', icon: <XCircle size={14} className="mr-1 text-red-600" /> },
];

// Định nghĩa các khung giờ tư vấn
const TIME_SLOTS = {
  1: "07:00 - 09:00",
  2: "09:00 - 11:00",
  3: "11:00 - 13:00",
  4: "13:00 - 15:00",
  5: "15:00 - 17:00"
};

function getGenderText(gender) {
  if (gender === 0) return 'Nam';
  if (gender === 2) return 'Nữ';
  return 'Khác';
}

function getStatusClass(status) {
  switch (status) {
    case 0: return 'bg-yellow-100 text-yellow-800';
    case 1: return 'bg-green-100 text-green-800';
    case 2: return 'bg-blue-100 text-blue-800';
    case 3: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

// Helper để hiển thị khung giờ từ slot
function getTimeSlotText(slot) {
  return TIME_SLOTS[slot] || 'Không xác định';
}

export default function ConsultingPanel({ selectedAppointment, setSelectedAppointment }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();
  const { user } = useAuth();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedForCall, setSelectedForCall] = useState(null);

  const handleStartVideoCall = (booking) => {
    setSelectedForCall(booking);
    setShowVideoCall(true);
  };

  const canStartVideoCall = (booking) => {
    if (booking.status !== 1) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(booking.appointmentDate);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate <= today;
  };
  const fetchConsultBookings = async () => {
    if (!user || !user.id) {
      setError("Không thể xác thực người dùng.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/servicebookings/consultant/${user.id}`);
      // Lấy lịch tư vấn (typeCode === 0) và đúng consultantId
      const consultBookings = (response.data || []).filter(
        booking =>
          booking.serviceTypeId &&
          booking.serviceTypeId.typeCode === 0 &&
          booking.consultantId &&
          String(booking.consultantId.id) === String(user.id)
      );
      setBookings(consultBookings);
    } catch (err) {
      setError("Không thể tải danh sách lịch tư vấn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultBookings();
  }, [user]);

  const handleStatusChange = async (id, statusNumber) => {
    if (!window.confirm('Bạn có chắc chắn muốn cập nhật trạng thái lịch tư vấn này?')) {
      return;
    }
    setUpdatingId(id);
    try {
      await api.put(`/api/servicebooking/status/${id}/${statusNumber}`);
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: statusNumber } : b))
      );
      showToast('Cập nhật trạng thái thành công!', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Cập nhật trạng thái thất bại!';
      showToast(errorMessage, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetail = (booking) => {
    setSelectedAppointment(booking);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lịch đặt tư vấn</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Chưa có lịch tư vấn nào
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 font-semibold border-b p-4 bg-gray-50">
                <div>Họ tên</div>
                <div>Giới tính</div>
                <div>Ngày hẹn</div>
                <div>Khung giờ</div>
                <div>Dịch vụ</div>
                <div>Trạng thái</div>
                <div className="text-right">Thao tác</div>
              </div>
              {bookings.map((booking) => (
                <div key={booking.id} className="grid grid-cols-7 items-center p-4 border-b last:border-b-0 hover:bg-gray-50">
                  <div className="font-medium text-gray-800">{booking.customerId?.name}</div>
                  <div>{getGenderText(booking.customerId?.gender)}</div>
                  <div>{new Date(booking.appointmentDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}</div>
                  <div className="text-indigo-600 font-medium">
                    {getTimeSlotText(booking.slot)}
                  </div>
                  <div>{booking.serviceTypeId?.name}</div>
                  <div>
                    <div className="relative">
                      <select
                        className={`border rounded px-3 py-1.5 pr-9 appearance-none ${getStatusClass(booking.status)} w-full`}
                        value={booking.status}
                        disabled={updatingId === booking.id}
                        onChange={e => handleStatusChange(booking.id, Number(e.target.value))}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {updatingId === booking.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">                    
                    <button
                      onClick={() => handleViewDetail(booking)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                    </button>
                    {canStartVideoCall(booking) && (
                    <button
                      onClick={() => handleStartVideoCall(booking)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Bắt đầu tư vấn video"
                    >
                      <Video size={16} />
                    </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {/* Video Call Modal */}
      {showVideoCall && selectedForCall && (
        <VideoCallManager
          appointment={selectedForCall}
          onClose={() => {
            setShowVideoCall(false);
            setSelectedForCall(null);
          }}
        />
      )}
      {/* Modal chi tiết lịch tư vấn */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Chi tiết lịch tư vấn</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Thông tin khách hàng</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-500">Họ tên:</span></p>
                  <p className="font-medium">{selectedAppointment.customerId?.name}</p>
                  <p><span className="text-gray-500">Giới tính:</span></p>
                  <p className="font-medium">{getGenderText(selectedAppointment.customerId?.gender)}</p>
                  <p><span className="text-gray-500">Điện thoại:</span></p>
                  <p className="font-medium">{selectedAppointment.customerId?.phone || 'Không có'}</p>
                  <p><span className="text-gray-500">Email:</span></p>
                  <p className="font-medium">{selectedAppointment.customerId?.email || 'Không có'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Thông tin lịch tư vấn</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-500">Dịch vụ:</span></p>
                  <p className="font-medium">{selectedAppointment.serviceTypeId?.name}</p>
                  <p><span className="text-gray-500">Giá:</span></p>
                  <p className="font-medium">{selectedAppointment.serviceTypeId?.price?.toLocaleString('vi-VN')} VNĐ</p>
                  <p><span className="text-gray-500">Ngày hẹn:</span></p>
                  <p className="font-medium">
                    {new Date(selectedAppointment.appointmentDate).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p><span className="text-gray-500">Khung giờ:</span></p>
                  <p className="font-medium text-indigo-600">{getTimeSlotText(selectedAppointment.slot)}</p>
                  <p><span className="text-gray-500">Trạng thái:</span></p>
                  <p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(selectedAppointment.status)}`}>
                      {STATUS_OPTIONS.find(opt => opt.value === selectedAppointment.status)?.icon}
                      {STATUS_OPTIONS.find(opt => opt.value === selectedAppointment.status)?.label}
                    </span>
                  </p>
                </div>
              </div>
              {selectedAppointment.description && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Ghi chú</h4>
                  <p className="text-sm italic">{selectedAppointment.description}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <div className="space-x-2">
                {selectedAppointment.status !== 2 && selectedAppointment.status !== 3 && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, 2);
                      setSelectedAppointment(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Đánh dấu hoàn thành
                  </button>
                )}
                {selectedAppointment.status !== 3 && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, 3);
                      setSelectedAppointment(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Hủy lịch tư vấn
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
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