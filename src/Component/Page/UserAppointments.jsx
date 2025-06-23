import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Calendar, Package, Plus, Eye, X, XCircle, Stethoscope, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';
import api from '../config/axios';

export default function UserAppointments() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [appointments, setAppointments] = useState({ test: [], medical: [] });
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);


    // Modal state
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);

    // Lấy lịch xét nghiệm từ API backend
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/servicebookings/customer/${user.id}`);
                const allBookings = res.data || [];

                console.log('All bookings from API:', allBookings);

                // Loại bỏ trùng lặp TRƯỚC KHI lọc
                const uniqueBookings = allBookings.filter((booking, index, self) =>
                    index === self.findIndex(b => b.id === booking.id)
                );

                console.log('Unique bookings:', uniqueBookings);

                // Lọc từng loại
                const testBookings = uniqueBookings.filter(
                    booking => booking.serviceTypeId && booking.serviceTypeId.id === 2
                );

                const medicalBookings = uniqueBookings.filter(
                    booking => booking.serviceTypeId && booking.serviceTypeId.id === 8 // Đổi từ 8 thành 1
                );

                console.log('Test bookings:', testBookings);
                console.log('Medical bookings:', medicalBookings);

                setAppointments({
                    test: testBookings,
                    medical: medicalBookings
                });
            } catch (err) {
                showToast('Không thể tải lịch từ server', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [user, navigate, showToast]);

    // Hàm xử lý xóa booking
    const handleDeleteBooking = async (bookingId) => {
        if (!bookingId) {
            showToast('ID booking không hợp lệ', 'error');
            return;
        }

        setDeletingId(bookingId);
        try {
            // Gọi API DELETE
            await api.delete(`/api/user/${bookingId}`);

            // Cập nhật state local để loại bỏ booking đã xóa
            setAppointments(prev => ({
                test: prev.test.filter(booking => booking.id !== bookingId),
                medical: prev.medical.filter(booking => booking.id !== bookingId)
            }));

            showToast('Đã hủy lịch hẹn thành công!', 'success');
            setShowDeleteModal(false);
            setAppointmentToDelete(null);
        } catch (error) {
            console.error('Delete booking error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Không thể hủy lịch hẹn. Vui lòng thử lại!';
            showToast(errorMessage, 'error');
        } finally {
            setDeletingId(null);
        }
    };

    // Modal handlers
    const handleViewDetail = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailModal(true);
    };
    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedAppointment(null);
    };

    // Mở modal xác nhận xóa
    const openDeleteModal = (appointment) => {
        setAppointmentToDelete(appointment);
        setShowDeleteModal(true);
    };

    // Đóng modal xác nhận xóa
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAppointmentToDelete(null);
    };

    // Kiểm tra có thể hủy được không (chỉ cho phép hủy nếu chưa hoàn thành)
    const canCancelAppointment = (status) => {
        return status === 0 || status === 1; // Chỉ cho phép hủy nếu đang chờ xác nhận hoặc đã xác nhận
    };

    // Status helpers (tuỳ chỉnh theo backend)
    const getStatusText = (status) => {
        switch (status) {
            case 0: return 'Chờ xác nhận';
            case 1: return 'Đã xác nhận';
            case 2: return 'Hoàn thành';
            case 3: return 'Đã hủy';
            default: return 'Không xác định';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'bg-yellow-100 text-yellow-800';
            case 1: return 'bg-green-100 text-green-800';
            case 2: return 'bg-blue-100 text-blue-800';
            case 3: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 mt-10">
            <Header />

            <div className="container mx-auto px-4 py-8 ">
                <div className="max-w-4xl mx-auto">
                    {/* Lịch khám bệnh */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="text-blue-600" size={18} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Lịch khám bệnh</h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {appointments.medical.length} lịch hẹn
                                </span>
                            </div>
                        </div>

                        {loading ? (
                            <div>Đang tải dữ liệu...</div>
                        ) : appointments.medical.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Stethoscope className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có lịch khám bệnh</h3>
                                <p className="text-gray-600 mb-6">Đặt lịch khám bệnh với các bác sĩ chuyên khoa</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.medical.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group relative p-6">
                                        {/* Status Banner */}
                                        <div className={`h-1 w-full ${getStatusColor(booking.status)}`}></div>

                                        <div className="pt-4">
                                            {/* Doctor Info */}
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                                                    <Stethoscope className="text-white" size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 text-lg">
                                                        {booking.consultantId?.name || 'Bác sĩ không xác định'}
                                                    </h3>
                                                    <div className="text-gray-600 text-sm">
                                                        {booking.consultantId?.specialization}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Service Type */}
                                            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                                                <p className="text-sm font-medium text-blue-800">
                                                    Gói dịch vụ: {booking.serviceTypeId?.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {booking.serviceTypeId?.description}
                                                </p>
                                                <p className="text-sm text-blue-700 font-medium">
                                                    Giá: {booking.serviceTypeId?.price?.toLocaleString('vi-VN')} VNĐ
                                                </p>
                                            </div>

                                            {/* DateTime */}
                                            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar size={16} className="text-blue-500" />
                                                    <span>{new Date(booking.appointmentDate).toLocaleDateString('vi-VN', {
                                                        weekday: 'short',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>

                                            {/* Status and Actions */}
                                            <div className="flex items-center justify-between">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                    {getStatusText(booking.status)}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetail(booking)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {/* Nút hủy lịch hẹn */}
                                                    {canCancelAppointment(booking.status) && (
                                                        <button
                                                            onClick={() => openDeleteModal(booking)}
                                                            disabled={deletingId === booking.id}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Hủy lịch hẹn"
                                                        >
                                                            {deletingId === booking.id ? (
                                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <Trash2 size={16} />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Lịch xét nghiệm */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Package className="text-green-600" size={18} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Lịch xét nghiệm</h2>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    {appointments.test.length} lịch hẹn
                                </span>
                            </div>
                        </div>

                        {loading ? (
                            <div>Đang tải dữ liệu...</div>
                        ) : appointments.test.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có lịch xét nghiệm</h3>
                                <p className="text-gray-600 mb-6">Đặt lịch xét nghiệm với các gói dịch vụ toàn diện</p>
                                <Link
                                    to="/test"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                                >
                                    <Plus size={18} />
                                    <span>Đặt lịch xét nghiệm</span>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.test.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group relative p-6">
                                        {/* Status Banner */}
                                        <div className={`h-1 w-full ${getStatusColor(booking.status)}`}></div>

                                        <div className="pt-4">
                                            {/* Kit Info */}
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                                                    <Package className="text-white" size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 text-lg">
                                                        {booking.serviceTypeId?.name || 'Không xác định'}
                                                    </h3>
                                                    <div className="text-gray-600 text-sm">
                                                        {booking.serviceTypeId?.description}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                                <p className="text-sm font-medium text-purple-800">
                                                    Giá: {booking.serviceTypeId?.price?.toLocaleString('vi-VN')} VNĐ
                                                </p>
                                            </div>

                                            {/* DateTime */}
                                            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar size={16} className="text-blue-500" />
                                                    <span>{new Date(booking.appointmentDate).toLocaleDateString('vi-VN', {
                                                        weekday: 'short',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>

                                            {/* Status and Actions */}
                                            <div className="flex items-center justify-between">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                    {getStatusText(booking.status)}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetail(booking)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    {/* Nút hủy lịch hẹn */}
                                                    {canCancelAppointment(booking.status) && (
                                                        <button
                                                            onClick={() => openDeleteModal(booking)}
                                                            disabled={deletingId === booking.id}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Hủy lịch hẹn"
                                                        >
                                                            {deletingId === booking.id ? (
                                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <Trash2 size={16} />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal xác nhận xóa */}
            {showDeleteModal && appointmentToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                <XCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Xác nhận hủy lịch hẹn
                            </h3>
                            <p className="text-sm text-gray-500 mb-1">
                                Bạn có chắc chắn muốn hủy lịch hẹn:
                            </p>
                            <p className="font-medium text-gray-800 mb-1">
                                {appointmentToDelete.serviceTypeId?.name}
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                Ngày: {new Date(appointmentToDelete.appointmentDate).toLocaleDateString('vi-VN')}
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                                <p className="text-sm text-yellow-800">
                                    ⚠️ Hành động này không thể hoàn tác. Vui lòng liên hệ với chúng tôi nếu cần đặt lại lịch hẹn.
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={closeDeleteModal}
                                disabled={deletingId === appointmentToDelete.id}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={() => handleDeleteBooking(appointmentToDelete.id)}
                                disabled={deletingId === appointmentToDelete.id}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {deletingId === appointmentToDelete.id ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Đang hủy...
                                    </>
                                ) : (
                                    'Xác nhận hủy'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chi tiết lịch hẹn */}
            {showDetailModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">
                                    Chi tiết lịch xét nghiệm
                                </h3>
                                <button
                                    onClick={closeDetailModal}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className={`px-4 py-2 rounded-md ${getStatusColor(selectedAppointment.status)} inline-block`}>
                                {getStatusText(selectedAppointment.status)}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Gói xét nghiệm</h4>
                                <p className="font-medium text-gray-800">{selectedAppointment.serviceTypeId?.name}</p>
                                <p className="text-sm text-gray-600">{selectedAppointment.serviceTypeId?.description}</p>
                                <p className="text-sm text-gray-600">Giá: {selectedAppointment.serviceTypeId?.price?.toLocaleString('vi-VN')} VNĐ</p>
                                <p className="text-sm text-gray-600">Thời gian: {selectedAppointment.duration} phút</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Ngày hẹn</h4>
                                <p className="text-sm text-gray-600">
                                    {new Date(selectedAppointment.appointmentDate).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Ghi chú</h4>
                                <p className="text-sm text-gray-600">{selectedAppointment.description || 'Không có'}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3 p-4">
                            <button
                                onClick={closeDetailModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}