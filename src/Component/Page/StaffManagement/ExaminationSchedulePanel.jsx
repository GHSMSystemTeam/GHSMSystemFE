import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Clock, XCircle, Check, User, Phone, Search, Filter, Calendar } from 'lucide-react';
import api from '../../config/axios';
import { useToast } from '../../Toast/ToastProvider';
import { useAuth } from '../../Auth/AuthContext';

const STATUS_OPTIONS = [
  { value: 0, label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  { value: 1, label: 'Đã xác nhận', color: 'bg-green-100 text-green-800' },
  { value: 2, label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800' },
  { value: 3, label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
];

const TIME_SLOTS = {
  1: "07:00",
  2: "09:00", 
  3: "11:00",
  4: "13:00",
  5: "15:00"
};

function getGenderText(gender) {
  if (gender === 0) return 'Nam';
  if (gender === 1) return 'Nữ';
  return 'Khác';
}

function getStatusClass(status) {
  const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
  return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
}

function getTimeSlotText(slot) {
  return TIME_SLOTS[slot] || 'Không xác định';
}

export default function ExaminationSchedulePanel({ selectedAppointment, setSelectedAppointment }) {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerId: { name: 'dang khoa', gender: 0 },
      appointmentDate: '2025-08-08',
      slot: 1,
      serviceTypeId: { name: 'Tư vấn sinh lý nam' },
      status: 0
    },
    {
      id: 2,
      customerId: { name: 'Du Thuc Lan', gender: 1 },
      appointmentDate: '2025-12-12',
      slot: 1,
      serviceTypeId: { name: 'Tư vấn sinh lý nam' },
      status: 2
    },
    {
      id: 3,
      customerId: { name: 'Dang Minh Chau', gender: 1 },
      appointmentDate: '2025-08-09',
      slot: 1,
      serviceTypeId: { name: 'Tư vấn sinh lý nam' },
      status: 1
    },
    {
      id: 4,
      customerId: { name: 'Tran Huu Dang Quan', gender: 0 },
      appointmentDate: '2025-06-27',
      slot: 1,
      serviceTypeId: { name: 'Tư vấn sinh lý nam' },
      status: 2
    },
    {
      id: 5,
      customerId: { name: 'Vu Ha Anh', gender: 1 },
      appointmentDate: '2025-06-28',
      slot: 1,
      serviceTypeId: { name: 'Tư vấn sinh lý nam' },
      status: 2
    },
    {
      id: 6,
      customerId: { name: 'Tran Huu Dang Quan', gender: 0 },
      appointmentDate: '2025-06-27',
      slot: 1,
      serviceTypeId: { name: 'Tư vấn sinh lý nam' },
      status: 2
    },
    {
      id: 7,
      customerId: { name: 'dang khoa', gender: 0 },
      appointmentDate: '2025-07-01',
      slot: 1,
      serviceTypeId: { name: 'Tư vấn sinh lý nam' },
      status: 0
    },
    {
      id: 8,
      customerId: { name: 'Dinh Duy Hoang', gender: 0 },
      appointmentDate: '2025-10-15',
      slot: 1,
      serviceTypeId: { name: 'Tư vấn sinh lý nam' },
      status: 0
    },
    {
      id: 9,
      customerId: { name: 'Tran Duc Hai', gender: 1 },
      appointmentDate: '2026-02-03',
      slot: 1,
      serviceTypeId: { name: 'Tư vấn sinh lý nam' },
      status: 1
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleStatusChange = async (id, statusNumber) => {
    if (!window.confirm('Bạn có chắc chắn muốn cập nhật trạng thái lịch tư vấn này?')) {
      return;
    }
    setUpdatingId(id);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: statusNumber } : b))
      );
      showToast('Cập nhật trạng thái thành công!', 'success');
    } catch (err) {
      showToast('Cập nhật trạng thái thất bại!', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetail = (booking) => {
    setSelectedAppointment(booking);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Họ tên
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Giới tính
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Ngày hẹn
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Dịch vụ tư vấn
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.customerId?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getGenderText(booking.customerId?.gender)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getTimeSlotText(booking.slot)} {formatDate(booking.appointmentDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {booking.serviceTypeId?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative">
                    <select
                      className={`appearance-none border rounded px-3 py-2 pr-8 text-sm font-medium ${getStatusClass(booking.status)} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetail(booking)}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
                    title="Xem chi tiết"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết lịch tư vấn */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
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
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Thông tin lịch tư vấn</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-500">Dịch vụ:</span></p>
                  <p className="font-medium">{selectedAppointment.serviceTypeId?.name}</p>
                  <p><span className="text-gray-500">Ngày hẹn:</span></p>
                  <p className="font-medium">{formatDate(selectedAppointment.appointmentDate)}</p>
                  <p><span className="text-gray-500">Khung giờ:</span></p>
                  <p className="font-medium">{getTimeSlotText(selectedAppointment.slot)}</p>
                  <p><span className="text-gray-500">Trạng thái:</span></p>
                  <p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(selectedAppointment.status)}`}>
                      {STATUS_OPTIONS.find(opt => opt.value === selectedAppointment.status)?.label}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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

      {/* Bookings Table - Style like the template image */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Không có lịch hẹn nào
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Họ tên</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Giới tính</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ngày hẹn</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Dịch vụ xét nghiệm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getGenderText(booking.gender)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.appointmentDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getTimeSlotText(booking.timeSlot)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {booking.examinationTypeName}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, parseInt(e.target.value))}
                        disabled={updatingId === booking.id}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusClass(booking.status)}`}
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        <Eye size={16} className="inline mr-1" />
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

