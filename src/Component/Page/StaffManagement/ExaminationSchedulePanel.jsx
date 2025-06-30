import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Eye, CheckCircle, Clock, XCircle, Check, User, Phone } from 'lucide-react';
import api from '../../config/axios';
import { useToast } from '../../Toast/ToastProvider';
import { useAuth } from '../../Auth/AuthContext';

const STATUS_OPTIONS = [
  { value: 0, label: 'Chờ xác nhận', icon: <Clock size={14} className="mr-1 text-yellow-600" /> },
  { value: 1, label: 'Đã xác nhận', icon: <CheckCircle size={14} className="mr-1 text-green-600" /> },
  { value: 2, label: 'Hoàn thành', icon: <Check size={14} className="mr-1 text-blue-600" /> },
  { value: 3, label: 'Đã hủy', icon: <XCircle size={14} className="mr-1 text-red-600" /> },
];

const TIME_SLOTS = {
  1: "07:00 - 09:00",
  2: "09:00 - 11:00",
  3: "11:00 - 13:00",
  4: "13:00 - 15:00",
  5: "15:00 - 17:00"
};

function getGenderText(gender) {
  if (gender === 0) return 'Nam';
  if (gender === 1) return 'Nữ';
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

function getTimeSlotText(slot) {
  return TIME_SLOTS[slot] || 'Không xác định';
}

export default function ExaminationSchedulePanel({ selectedAppointment, setSelectedAppointment }) {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Fetch exam bookings
  useEffect(() => {
    fetchExamBookings();
  }, []);

  // Filter bookings based on search and filters
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phoneNumber?.includes(searchTerm) ||
        booking.examinationTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === parseInt(statusFilter));
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.appointmentDate).toISOString().split('T')[0];
        return bookingDate === dateFilter;
      });
    }

    // Sort by appointment date and time slot
    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDate);
      const dateB = new Date(b.appointmentDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      return a.timeSlot - b.timeSlot;
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const fetchExamBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/exam-bookings');
      setBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching exam bookings:', err);
      setError('Không thể tải dữ liệu lịch xét nghiệm');
      showToast('Lỗi khi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      await api.put(`/api/exam-bookings/${bookingId}/status`, { status: newStatus });
      
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      const statusLabel = STATUS_OPTIONS.find(opt => opt.value === newStatus)?.label;
      showToast(`Đã cập nhật trạng thái thành "${statusLabel}"`, 'success');
      
    } catch (err) {
      console.error('Error updating booking status:', err);
      showToast('Lỗi khi cập nhật trạng thái', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedAppointment(booking);
    setShowDetailModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getUpcomingBookingsCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookings.filter(booking => {
      const appointmentDate = new Date(booking.appointmentDate);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today && booking.status !== 3;
    }).length;
  };

  const getTodayBookingsCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.appointmentDate).toISOString().split('T')[0];
      return bookingDate === today && booking.status !== 3;
    }).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchExamBookings}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Tổng lịch hẹn</p>
              <p className="text-2xl font-bold text-blue-800">{bookings.length}</p>
            </div>
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Hôm nay</p>
              <p className="text-2xl font-bold text-green-800">{getTodayBookingsCount()}</p>
            </div>
            <Clock className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Sắp tới</p>
              <p className="text-2xl font-bold text-yellow-800">{getUpcomingBookingsCount()}</p>
            </div>
            <CheckCircle className="text-yellow-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
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
              {STATUS_OPTIONS.map(option => (
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

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày & Giờ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại xét nghiệm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Không có lịch hẹn nào
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.fullName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {booking.phoneNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getGenderText(booking.gender)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.appointmentDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getTimeSlotText(booking.timeSlot)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.examinationTypeName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.price?.toLocaleString('vi-VN')}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(booking.status)}`}>
                        {STATUS_OPTIONS.find(opt => opt.value === booking.status)?.icon}
                        {STATUS_OPTIONS.find(opt => opt.value === booking.status)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>

                        {booking.status === 0 && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 1)}
                            disabled={updatingId === booking.id}
                            className="text-green-600 hover:text-green-900 p-1 rounded disabled:opacity-50"
                            title="Xác nhận"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        {booking.status === 1 && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 2)}
                            disabled={updatingId === booking.id}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded disabled:opacity-50"
                            title="Hoàn thành"
                          >
                            <Check size={16} />
                          </button>
                        )}

                        {booking.status !== 3 && booking.status !== 2 && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 3)}
                            disabled={updatingId === booking.id}
                            className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                            title="Hủy"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chi tiết lịch hẹn</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                  <p className="text-sm text-gray-900">{getGenderText(selectedAppointment.gender)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                  <p className="text-sm text-gray-900">
                    {selectedAppointment.dateOfBirth ? formatDate(selectedAppointment.dateOfBirth) : 'Chưa cập nhật'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.address || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ngày hẹn</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedAppointment.appointmentDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Khung giờ</label>
                  <p className="text-sm text-gray-900">{getTimeSlotText(selectedAppointment.timeSlot)}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Loại xét nghiệm</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.examinationTypeName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giá tiền</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.price?.toLocaleString('vi-VN')}đ</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(selectedAppointment.status)}`}>
                    {STATUS_OPTIONS.find(opt => opt.value === selectedAppointment.status)?.icon}
                    {STATUS_OPTIONS.find(opt => opt.value === selectedAppointment.status)?.label}
                  </span>
                </div>
              </div>
              
              {selectedAppointment.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                  <p className="text-sm text-gray-900">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
