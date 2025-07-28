import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Clock, XCircle, Check, Video, Search } from 'lucide-react';
import api from '../../config/axios';
import { useToast } from '../../Toast/ToastProvider';
import { useAuth } from '../../Auth/AuthContext';
import VideoCallManager from '../VideoCall/VideoCallManager';
//Status hiển thị (consultant sẽ thấy)
const STATUS_DISPLAY = [
  { value: 0, label: 'Chờ xác nhận', icon: <Clock size={14} className="mr-1 text-yellow-600" /> },
  { value: 1, label: 'Đã xác nhận', icon: <CheckCircle size={14} className="mr-1 text-green-600" /> },
  { value: 2, label: 'Đã Hoàn thành', icon: <Check size={14} className="mr-1 text-blue-600" /> },
];
// Actions trong dropdown (consultant chỉ có thể chọn)
const STATUS_ACTIONS = [
  { value: 1, label: 'Xác nhận', icon: <CheckCircle size={14} className="mr-1 text-green-600" /> },
  { value: 2, label: 'Hoàn thành', icon: <Check size={14} className="mr-1 text-blue-600" /> },
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
  const [openDropdown, setOpenDropdown] = useState(null);
  // Thêm state cho modal xác nhận hoàn thành
  const [showCompleteConfirmModal, setShowCompleteConfirmModal] = useState(false);
  const [bookingToComplete, setBookingToComplete] = useState(null);

  // Thêm state cho bộ lọc
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // Thêm state cho payment status
  const [paidBookingIds, setPaidBookingIds] = useState([]);
  // Thêm hàm fetch payment status
  const fetchPaymentStatus = async () => {
    try {
      // Lấy tất cả transaction thành công
      const allTransactions = [];

      // Lấy transaction cho từng booking
      for (const booking of bookings) {
        if (booking.customerId?.id) {
          try {
            const transRes = await api.get(`/transaction/customerId/${booking.customerId.id}`);
            const transactions = transRes.data || [];
            allTransactions.push(...transactions);
          } catch (err) {
            console.warn(`Failed to fetch transactions for user ${booking.customerId.id}:`, err);
          }
        }
      }

      // Lọc các appointment đã thanh toán
      const paidIds = allTransactions
        .filter(t => t.resultCode === "00" || t.status === "SUCCESS")
        .map(t => t.appointmentId)
        .filter(id => id); // Loại bỏ null/undefined

      setPaidBookingIds(paidIds);
    } catch (error) {
      console.error('Error fetching payment status:', error);
    }
  };

  // Thêm hàm kiểm tra đã thanh toán
  const isBookingPaid = (bookingId) => {
    return paidBookingIds.includes(bookingId);
  };

  // Thêm hàm kiểm tra có nên hiển thị trạng thái thanh toán không
  const shouldShowPaymentStatus = (booking) => {
    return booking.status === 0; // Chỉ hiển thị cho lịch chờ xác nhận
  };

  // Cập nhật useEffect để fetch payment status sau khi có bookings
  useEffect(() => {
    if (bookings.length > 0) {
      fetchPaymentStatus();
    }
  }, [bookings]);


  const handleStartVideoCall = (booking) => {
    setSelectedForCall(booking);
    setShowVideoCall(true);
  };

  const canStartVideoCall = (booking) => {
    // Chỉ cho phép bắt đầu video call nếu trạng thái là "Đã xác nhận" (1) hoặc "Hoàn thành" (2)
    return booking.status === 1;
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
      const consultBookings = (response.data || [])
        .filter(
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
  // Thêm useEffect để handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.relative')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Thêm hàm getSortPriorityByStatus
  const getSortPriorityByStatus = (status) => {
    switch (status) {
      case 0: return 1; // Chưa xác nhận - ưu tiên hàng đầu
      case 1: return 2; // Đã xác nhận - ưu tiên thứ hai
      case 2: return 3; // Hoàn thành - ưu tiên thứ ba
      default: return 5;
    }
  };
  const getStatusActions = (currentStatus) => {
    switch (currentStatus) {
      case 0: // Chờ xác nhận - chỉ có thể "Xác nhận"
        return [
          { value: 1, label: 'Xác nhận', icon: <CheckCircle size={14} className="mr-1 text-green-600" /> }
        ];
      case 1: // Đã xác nhận - chỉ có thể "Hoàn thành"
        return [
          { value: 2, label: 'Hoàn thành', icon: <Check size={14} className="mr-1 text-blue-600" /> }
        ];
      case 2: // Đã hoàn thành - không có action nào
        return [];
      default:
        return STATUS_ACTIONS;
    }
  };

  // Thêm useEffect để lọc kết quả dựa trên các bộ lọc
  useEffect(() => {
    let filtered = [...bookings];

    // Lọc theo search
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerId?.phone?.includes(searchTerm) ||
        booking.serviceTypeId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === parseInt(statusFilter));
    }

    // Lọc theo ngày
    if (dateFilter) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.appointmentDate).toISOString().split('T')[0];
        return bookingDate === dateFilter;
      });
    }

    // Sắp xếp theo trạng thái ưu tiên
    filtered.sort((a, b) => {
      // Đầu tiên sắp xếp theo độ ưu tiên của trạng thái
      const priorityDiff = getSortPriorityByStatus(a.status) - getSortPriorityByStatus(b.status);
      if (priorityDiff !== 0) return priorityDiff;

      // Nếu cùng trạng thái, sắp xếp theo ngày gần nhất
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      if (dateA > dateB) return 1;
      if (dateA < dateB) return -1;

      // Nếu cùng ngày, sắp xếp theo khung giờ
      return a.slot - b.slot;
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const getStatusDisplay = (status) => {
    return STATUS_DISPLAY.find(opt => opt.value === status) || STATUS_DISPLAY[0];
  };

  const handleStatusChange = async (id, statusNumber) => {
    const currentBooking = bookings.find(b => b.id === id);

    // Kiểm tra logic chuyển đổi status
    if (currentBooking.status === 0 && statusNumber === 1) {
      // Chờ xác nhận → Đã xác nhận
      if (!window.confirm('Bạn có chắc chắn muốn xác nhận lịch tư vấn này?')) {
        return;
      }
    } else if (currentBooking.status === 1 && statusNumber === 2) {
      // Đã xác nhận → Hoàn thành
      setBookingToComplete(currentBooking);
      setShowCompleteConfirmModal(true);
      return;
    } else {
      // Các thay đổi không hợp lệ
      showToast('Không thể thay đổi trạng thái này!', 'error');
      return;
    }

    setUpdatingId(id);
    try {
      await api.put(`/api/servicebooking/status/${id}/${statusNumber}`);
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: statusNumber } : b))
      );

      const statusText = getStatusDisplay(statusNumber)?.label;
      showToast(`Đã cập nhật trạng thái thành "${statusText}"!`, 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Cập nhật trạng thái thất bại!';
      showToast(errorMessage, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmComplete = async () => {
    if (!bookingToComplete) return;

    const id = bookingToComplete.id;
    setUpdatingId(id);

    try {
      await api.put(`/api/servicebooking/status/${id}/2`);
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: 2 } : b))
      );
      showToast('Đã chuyển trạng thái thành "Hoàn thành"!', 'success');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Cập nhật trạng thái thất bại!';
      showToast(errorMessage, 'error');
    } finally {
      setUpdatingId(null);
      setShowCompleteConfirmModal(false);
      setBookingToComplete(null);
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

      {/* Thêm bộ lọc tìm kiếm */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              {STATUS_DISPLAY.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày hẹn
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
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
        <div className="bg-white rounded-lg shadow overflow-visible">
          {filteredBookings.length === 0 ? ( // Thay đổi bookings thành filteredBookings
            <div className="p-8 text-center text-gray-500">
              {bookings.length > 0 ? "Không tìm thấy lịch tư vấn phù hợp" : "Chưa có lịch tư vấn nào"}
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
              <div className="max-h-96 overflow-y-auto">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="grid grid-cols-7 items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
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
                    <div className="flex flex-col min-w-[180px] break-words">
                      <span>{booking.serviceTypeId?.name}</span>
                      {shouldShowPaymentStatus(booking) && (
                        <span className="mt-1">
                          {isBookingPaid(booking.id) ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                              <CheckCircle size={10} className="mr-1" /> Đã thanh toán
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                              <XCircle size={10} className="mr-1" /> Chưa thanh toán
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <div>
                      {/* Status dropdown với overflow visible */}
                      <div className="relative z-20">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 ${getStatusClass(booking.status)} ${getStatusActions(booking.status).length > 0 ? 'hover:ring-2 hover:ring-blue-300 hover:shadow-md' : ''}`}
                          onClick={() => {
                            if (getStatusActions(booking.status).length > 0) {
                              const newDropdown = openDropdown === booking.id ? null : booking.id;
                              setOpenDropdown(newDropdown);
                            }
                          }}
                        >
                          {getStatusDisplay(booking.status)?.icon}
                          {getStatusDisplay(booking.status)?.label}
                          {getStatusActions(booking.status).length > 0 && (
                            <svg
                              className={`ml-1 h-3 w-3 text-gray-500 hover:text-gray-700 transition-all duration-200 ${openDropdown === booking.id ? 'rotate-180 text-blue-600' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>

                        {/* Dropdown menu */}
                        {getStatusActions(booking.status).length > 0 && openDropdown === booking.id && (
                          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                            {/* Arrow pointer */}
                            <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-200"></div>
                            <div className="absolute -top-1 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white"></div>

                            <div className="py-1">
                              <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b rounded-t-lg flex items-center">
                                <Clock size={12} className="mr-1" />
                                Thao tác với lịch hẹn
                              </div>
                              {getStatusActions(booking.status).map(action => (
                                <button
                                  key={action.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(booking.id, action.value);
                                    setOpenDropdown(null);
                                  }}
                                  disabled={updatingId === booking.id}
                                  className={`w-full px-3 py-3 text-left text-sm transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${action.value === 1
                                    ? 'hover:bg-green-50 hover:text-green-700 hover:pl-4'
                                    : 'hover:bg-blue-50 hover:text-blue-700 hover:pl-4'
                                    }`}
                                >
                                  <div className="flex items-center flex-1">
                                    <div className="mr-2">{action.icon}</div>
                                    <div>
                                      <div className="font-medium">{action.label}</div>
                                      <div className="text-xs text-gray-500">
                                        {action.value === 1 ? 'Xác nhận và cho phép video call' : 'Kết thúc cuộc tư vấn'}
                                      </div>
                                    </div>
                                  </div>
                                  {updatingId === booking.id && (
                                    <div className={`w-4 h-4 border-2 ${action.value === 1 ? 'border-green-600' : 'border-blue-600'} border-t-transparent rounded-full animate-spin`}></div>
                                  )}
                                </button>
                              ))}
                            </div>
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
              </div>
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
                      {STATUS_DISPLAY.find(opt => opt.value === selectedAppointment.status)?.icon}
                      {STATUS_DISPLAY.find(opt => opt.value === selectedAppointment.status)?.label}
                    </span>
                  </p>
                  {/* Thêm trạng thái thanh toán trong modal */}
                  {shouldShowPaymentStatus(selectedAppointment) && (
                    <>
                      <p><span className="text-gray-500">Thanh toán:</span></p>
                      <p>
                        {isBookingPaid(selectedAppointment.id) ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                            <CheckCircle size={12} className="mr-1" /> Đã thanh toán
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                            <XCircle size={12} className="mr-1" /> Chưa thanh toán
                          </span>
                        )}
                      </p>
                    </>
                  )}
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
                      // Thay đổi để hiển thị modal xác nhận
                      setBookingToComplete(selectedAppointment);
                      setShowCompleteConfirmModal(true);
                      setSelectedAppointment(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Đánh dấu hoàn thành
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
      {/* Thêm modal xác nhận hoàn thành */}
      {showCompleteConfirmModal && bookingToComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Xác nhận hoàn thành</h3>
              <button
                onClick={() => setShowCompleteConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="py-4">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle size={30} className="text-blue-600" />
                </div>
              </div>

              <p className="text-center text-gray-700 mb-2">
                Bạn có chắc chắn muốn đánh dấu hoàn thành lịch tư vấn này?
              </p>

              <p className="text-center text-gray-500 text-sm">
                Sau khi hoàn thành, bạn sẽ không thể thay đổi trạng thái này.
              </p>

              <div className="mt-6 flex items-center space-x-3 justify-between">
                <p className="text-sm">
                  <span className="font-medium">{bookingToComplete.customerId?.name}</span>
                  <span className="text-gray-500"> - {bookingToComplete.serviceTypeId?.name}</span>
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Check size={14} className="mr-1" />
                  Hoàn thành
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4 pt-4 border-t">
              <button
                onClick={() => setShowCompleteConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmComplete}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Xác nhận hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}