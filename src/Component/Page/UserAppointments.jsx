import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import VideoCallManager from './VideoCall/VideoCallManager';

import {
    Calendar,
    Package, Plus, Eye, X, XCircle,
    Stethoscope, Trash2, Clock, User, UserRound,
    ClipboardList, Info, Download, CheckCircle,
    Check, Star, FileText, Video
} from 'lucide-react';
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

    // Rating modal state
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [appointmentToRate, setAppointmentToRate] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [ratingTitle, setRatingTitle] = useState('');
    const [ratingContent, setRatingContent] = useState('');
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    const [testResults, setTestResults] = useState([]); // Lưu kết quả xét nghiệm
    const [loadingResult, setLoadingResult] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);

    const [showVideoCall, setShowVideoCall] = useState(false);
    const [selectedForCall, setSelectedForCall] = useState(null);

    // State lưu danh sách các booking đã đánh giá
    const [ratedBookingIds, setRatedBookingIds] = useState([]);


    const canJoinVideoCall = (booking) => {
        if (booking.status !== 1) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingDate = new Date(booking.appointmentDate);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate <= today;
    };

    // Thêm hàm chuyển đổi slot thành khung giờ
    const getSlotTimeRange = (slot) => {
        switch (slot) {
            case 1: return "07:00 - 09:00";
            case 2: return "09:00 - 11:00";
            case 3: return "11:00 - 13:00";
            case 4: return "13:00 - 15:00";
            case 5: return "15:00 - 17:00";
            default: return "Chưa xác định";
        }
    };
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
                const allBookings = (res.data || []).map(b => ({
                    ...b,
                    status: b.status === 0 ? 1 : b.status
                }));

                // ...lọc và setAppointments như cũ...
                const uniqueBookings = allBookings.filter((booking, index, self) =>
                    index === self.findIndex(b => b.id === booking.id)
                );

                const testBookings = uniqueBookings.filter(
                    (booking) =>
                        booking.serviceTypeId &&
                        booking.serviceTypeId.typeCode === 1 &&
                        booking.status !== 2 // Ẩn lịch đã hoàn thành
                );

                const medicalBookings = uniqueBookings.filter(
                    (booking) =>
                        booking.serviceTypeId &&
                        booking.serviceTypeId.typeCode === 0 &&
                        booking.status !== 2 // Ẩn lịch đã hoàn thành
                );

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

    // Lấy danh sách các booking đã đánh giá khi load component
    useEffect(() => {
        if (!user || !user.id) {
            console.log('user hoặc user.id bị thiếu:', user);
            return;
        }
        const fetchUserRatings = async () => {
            try {
                console.log('Gọi API rating với user.id:', user.id);
                const res = await api.get(`/api/rating/userID/${user.id}`);
                if (Array.isArray(res.data)) {
                    setRatedBookingIds(res.data.map(r => r.serviceBookingId?.id));
                }
            } catch (err) {
                console.error('Lỗi khi lấy rating:', err);
            }
        };
        fetchUserRatings();
    }, [user]);

    // Kiểm tra đã đánh giá chưa
    const isAlreadyRated = (bookingId) => ratedBookingIds.includes(bookingId);

    // Hàm xử lý xóa booking
    const handleDeleteBooking = async (bookingId) => {
        if (!bookingId) {
            showToast('ID booking không hợp lệ', 'error');
            return;
        }

        setDeletingId(bookingId);
        try {
            // Gọi API DELETE
            await api.delete(`/api/booking/${bookingId}`);
            console.log('Booking ID cần xóa:', bookingId);

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
        return status === 1; // Chỉ cho phép hủy nếu đang chờ xác nhận hoặc đã xác nhận
    };

    // Status helpers (tuỳ chỉnh theo backend)
    const getStatusText = (status) => {
        switch (status) {
            case 1: return 'Đã xác nhận';
            case 2: return 'Hoàn thành';
            case 3: return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 1: return 'bg-green-100 text-green-800';
            case 2: return 'bg-blue-100 text-blue-800';
            case 3: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // THÊM: Kiểm tra liệu buổi hẹn đã hoàn thành chưa (status = 2) để cho phép đánh giá
    const canRateAppointment = (appointment) => {
        return appointment.status === 2; // Chỉ cho phép đánh giá khi đã hoàn thành
    };

    // THÊM: Mở modal đánh giá
    const openRatingModal = (appointment) => {
        if (isAlreadyRated(appointment.id)) {
            showToast('Bạn đã đánh giá lịch hẹn này rồi!', 'info');
            return;
        }
        setAppointmentToRate(appointment);
        setShowRatingModal(true);
    };

    // THÊM: Đóng modal đánh giá và reset form
    const closeRatingModal = () => {
        setShowRatingModal(false);
        setAppointmentToRate(null);
        setRatingValue(5);
        setRatingTitle('');
        setRatingContent('');
    };

    // THÊM: Hàm xử lý đánh giá
    const handleSubmitRating = async (e) => {
        e.preventDefault();
        if (!user || !appointmentToRate || !appointmentToRate.consultantId) {
            showToast('Không thể đánh giá, thiếu thông tin cần thiết', 'error');
            return;
        }

        setIsSubmittingRating(true);

        try {
            const ratingData = {
                customerId: user.id,
                consultantId: appointmentToRate.consultantId.id,
                serviceBookingId: appointmentToRate.id,
                title: ratingTitle,
                rating: ratingValue,
                content: ratingContent,
                isPublic: true
            };

            await api.post('/api/rating', ratingData);

            showToast('Đã gửi đánh giá thành công!', 'success');
            setRatedBookingIds(prev => [...prev, appointmentToRate.id]);
            closeRatingModal();
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Không thể gửi đánh giá. Vui lòng thử lại!';
            showToast(errorMessage, 'error');
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const renderStarRating = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <button
                    key={i}
                    type="button"
                    onClick={() => setRatingValue(i)}
                    className={`${i <= ratingValue ? 'text-yellow-400' : 'text-gray-300'} text-2xl focus:outline-none`}
                >
                    ★
                </button>
            );
        }
        return stars;
    };

    const fetchTestResults = async (customerId, bookingId) => {
        setLoadingResult(true);
        try {
            const res = await api.get(`/api/result/customer/${customerId}`);
            // Lọc đúng kết quả theo bookingId (serviceBookingId)
            let result = null;
            if (Array.isArray(res.data)) {
                result = res.data.find(r => r.serviceBookingId?.id === bookingId);
            }
            if (result) {
                setSelectedResult(result);
                setShowResultModal(true);
            } else {
                showToast('Không tìm thấy kết quả xét nghiệm cho lịch này', 'warning');
            }
        } catch (err) {
            showToast('Không thể tải kết quả xét nghiệm', 'error');
        } finally {
            setLoadingResult(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 mt-10">
            <Header />

            <div className="container mx-auto px-4 py-8 ">
                <div className="max-w-4xl mx-auto">
                    {/* Lịch tư vấn  */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="text-blue-600" size={18} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Lịch tư vấn</h2>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {appointments.medical.length} lịch hẹn
                                </span>
                            </div>
                            {/* Thêm link đến lịch sử tư vấn */}
                            <Link
                                to="/history-consultation"
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                <Clock size={16} className="mr-1.5" />
                                Xem lịch sử tư vấn
                            </Link>
                        </div>

                        {loading ? (
                            <div>Đang tải dữ liệu...</div>
                        ) : appointments.medical.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Stethoscope className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có lịch tư vấn</h3>
                                <p className="text-gray-600 mb-6">Đặt lịch tư vấn với các tư vấn viên chuyên khoa</p>

                                <Link
                                    to="/appointment"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                                >
                                    <Plus size={18} />
                                    <span>Đặt lịch tư vấn</span>
                                </Link>
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
                                                <div className="flex items-center space-x-2">
                                                    <Clock size={16} className="text-green-500" />
                                                    <span className="font-medium">{getSlotTimeRange(booking.slot)}</span>
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
                                                    {/* THÊM: Nút tham gia video call */}
                                                    {canJoinVideoCall(booking) && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedForCall(booking);
                                                                setShowVideoCall(true);
                                                            }}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Tham gia cuộc gọi video"
                                                        >
                                                            <Video size={16} />
                                                        </button>
                                                    )}
                                                    {/* THÊM: Nút đánh giá khi đã hoàn thành */}
                                                    {canRateAppointment(booking) && (
                                                        <button
                                                            onClick={() => openRatingModal(booking)}
                                                            className={`p-2 ${isAlreadyRated(booking.id) ? 'text-gray-400' : 'text-yellow-500 hover:bg-yellow-50'} rounded-lg transition-colors`}
                                                            title={isAlreadyRated(booking.id) ? "Bạn đã đánh giá" : "Đánh giá bác sĩ"}
                                                        >
                                                            <Star size={16} />
                                                        </button>
                                                    )}

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
                            {/* Thêm link đến lịch sử xét nghiệm */}
                            <Link
                                to="/history-test"
                                className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                                <Clock size={16} className="mr-1.5" />
                                Xem lịch sử xét nghiệm
                            </Link>

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
                                                <div className="flex items-center space-x-2">
                                                    <Clock size={16} className="text-green-500" />
                                                    <span className="font-medium">{getSlotTimeRange(booking.slot)}</span>
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

                                                    {/* THÊM: Nút đánh giá cho xét nghiệm khi đã hoàn thành và có consultantId */}
                                                    {canRateAppointment(booking) && booking.consultantId && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedForCall(booking);
                                                                setShowVideoCall(true);
                                                            }}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Tham gia cuộc gọi video"
                                                        >
                                                            <Video size={16} />
                                                        </button>
                                                    )}

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

            {/* THÊM: Modal đánh giá */}
            {showRatingModal && appointmentToRate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-scale-in">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold flex items-center">
                                    <Star className="fill-current mr-2" size={20} /> Đánh giá bác sĩ
                                </h3>
                                <button
                                    onClick={closeRatingModal}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitRating} className="p-6 space-y-6">
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <User className="text-indigo-600" size={28} />
                                </div>
                                <h4 className="font-semibold text-lg">
                                    {appointmentToRate.consultantId?.name || 'Bác sĩ'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {appointmentToRate.serviceTypeId?.name || 'Dịch vụ'} •
                                    {new Date(appointmentToRate.appointmentDate).toLocaleDateString('vi-VN')}
                                </p>

                                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        Đánh giá của bạn giúp chúng tôi nâng cao chất lượng dịch vụ và giúp người dùng khác
                                        lựa chọn bác sĩ phù hợp.
                                    </p>
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="flex flex-col items-center space-y-2">
                                <label className="text-gray-700 font-medium">Đánh giá của bạn</label>
                                <div className="flex space-x-1">
                                    {renderStarRating()}
                                </div>
                                <span className="text-sm text-gray-600 font-medium">
                                    {ratingValue === 1 && "Rất không hài lòng"}
                                    {ratingValue === 2 && "Không hài lòng"}
                                    {ratingValue === 3 && "Bình thường"}
                                    {ratingValue === 4 && "Hài lòng"}
                                    {ratingValue === 5 && "Rất hài lòng"}
                                </span>
                            </div>

                            {/* CẢM NGHĨ KHÁCH HÀNG */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cảm nghĩ của bạn về bác sĩ/dịch vụ
                                </label>
                                <textarea
                                    value={ratingContent}
                                    onChange={e => setRatingContent(e.target.value)}
                                    placeholder="Hãy chia sẻ cảm nghĩ, trải nghiệm hoặc lời nhắn của bạn..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={4}
                                    required
                                />
                            </div>



                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeRatingModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100"
                                    disabled={isSubmittingRating}
                                >
                                    Huỷ
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                                    disabled={isSubmittingRating}
                                >
                                    {isSubmittingRating ? (
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            <span>Đang gửi...</span>
                                        </div>
                                    ) : (
                                        "Gửi đánh giá"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal chi tiết lịch hẹn */}
            {showDetailModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        {/* Header với gradient màu khác nhau tùy loại lịch hẹn */}
                        <div className={`px-6 py-4 ${selectedAppointment.serviceTypeId?.id === 1
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
                            : 'bg-gradient-to-r from-purple-500 to-pink-600'
                            }`}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    {selectedAppointment.serviceTypeId?.id === 1
                                        ? <><Stethoscope className="mr-2" size={20} /> Chi tiết lịch khám bệnh</>
                                        : <><Package className="mr-2" size={20} /> Chi tiết lịch xét nghiệm</>
                                    }
                                </h3>
                                <button
                                    onClick={closeDetailModal}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Status Badge */}
                            <div className="flex justify-center">
                                <div className={`px-4 py-2 rounded-full ${getStatusColor(selectedAppointment.status)} font-medium text-sm inline-flex items-center`}>
                                    {selectedAppointment.status === 0 && <Clock size={16} className="mr-1" />}
                                    {selectedAppointment.status === 1 && <CheckCircle size={16} className="mr-1" />}
                                    {selectedAppointment.status === 2 && <Check size={16} className="mr-1" />}
                                    {selectedAppointment.status === 3 && <XCircle size={16} className="mr-1" />}
                                    {getStatusText(selectedAppointment.status)}
                                </div>
                            </div>

                            {/* Layout tùy loại lịch hẹn */}
                            {selectedAppointment.serviceTypeId?.id === 1 ? (
                                /* Layout cho lịch khám bệnh - 2 cột với đầy đủ thông tin */
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Cột 1: Thông tin lịch hẹn */}
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                                <Calendar size={16} className="mr-2 text-blue-500" />
                                                Thông tin lịch hẹn
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Loại dịch vụ:</span>
                                                    <span className="font-medium text-gray-800">{selectedAppointment.serviceTypeId?.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Ngày:</span>
                                                    <span className="font-medium text-gray-800">
                                                        {new Date(selectedAppointment.appointmentDate).toLocaleDateString('vi-VN', {
                                                            weekday: 'long',
                                                            day: 'numeric',
                                                            month: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Khung giờ:</span>
                                                    <span className="font-medium text-green-600">
                                                        {getSlotTimeRange(selectedAppointment.slot)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Chi phí:</span>
                                                    <span className="font-medium text-blue-600">
                                                        {selectedAppointment.serviceTypeId?.price?.toLocaleString('vi-VN')} VNĐ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bác sĩ phụ trách - chỉ hiển thị cho lịch khám bệnh */}
                                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                                <User size={16} className="mr-2 text-indigo-500" />
                                                Bác sĩ phụ trách
                                            </h4>
                                            <div className="flex items-center mt-2">
                                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white mr-3 shadow-md">
                                                    {selectedAppointment.consultantId?.profilePicture?.[0] ? (
                                                        <img
                                                            src={selectedAppointment.consultantId.profilePicture[0]}
                                                            alt={selectedAppointment.consultantId.name}
                                                            className="w-full h-full object-cover rounded-full"
                                                        />
                                                    ) : (
                                                        <UserRound size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{selectedAppointment.consultantId?.name || "Chưa phân công"}</p>
                                                    <p className="text-sm text-gray-600">{selectedAppointment.consultantId?.specialization || "Chuyên khoa chung"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột 2: Thông tin bệnh nhân và ghi chú */}
                                    <div className="space-y-4">
                                        {/* Thông tin bệnh nhân */}
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                                <UserRound size={16} className="mr-2 text-purple-500" />
                                                Thông tin bệnh nhân
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Họ và tên:</span>
                                                    <span className="font-medium text-gray-800">{selectedAppointment.customerId?.name || user?.fullName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Email:</span>
                                                    <span className="font-medium text-gray-800">{selectedAppointment.customerId?.email || user?.email}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Số điện thoại:</span>
                                                    <span className="font-medium text-gray-800">{selectedAppointment.customerId?.phone || user?.phone}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Giới tính:</span>
                                                    <span className="font-medium text-gray-800">
                                                        {selectedAppointment.customerId?.gender === 0 ? "Nam" :
                                                            selectedAppointment.customerId?.gender === 2 ? "Nữ" : "Không xác định"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ghi chú - chỉ hiển thị cho lịch khám bệnh */}
                                        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                                <ClipboardList size={16} className="mr-2 text-amber-500" />
                                                Ghi chú
                                            </h4>
                                            <p className="text-sm text-gray-700 italic">
                                                {selectedAppointment.description || "Không có ghi chú"}
                                            </p>
                                        </div>

                                        {/* Hướng dẫn */}
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                                <Info size={16} className="mr-2 text-green-500" />
                                                Hướng dẫn
                                            </h4>
                                            <ul className="text-xs text-gray-700 space-y-1">
                                                <li className="flex items-start">
                                                    <div className="min-w-[4px] h-1 mt-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                                    <span>Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="min-w-[4px] h-1 mt-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                                    <span>Mang theo CMND/CCCD và thẻ BHYT (nếu có)</span>
                                                </li>
                                                <li className="flex items-start">
                                                    <div className="min-w-[4px] h-1 mt-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                                    <span>Xuất trình mã QR này cho nhân viên tiếp đón khi đến khám</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Layout cho lịch xét nghiệm - 1 cột, không hiển thị bác sĩ phụ trách và ghi chú */
                                <div className="space-y-4">
                                    {/* Thông tin chi tiết xét nghiệm */}
                                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                            <Package size={16} className="mr-2 text-purple-500" />
                                            Thông tin gói xét nghiệm
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tên gói:</span>
                                                <span className="font-medium text-gray-800">{selectedAppointment.serviceTypeId?.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Mô tả:</span>
                                                <span className="font-medium text-gray-800">{selectedAppointment.serviceTypeId?.description || "Không có mô tả"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ngày hẹn:</span>
                                                <span className="font-medium text-gray-800">
                                                    {new Date(selectedAppointment.appointmentDate).toLocaleDateString('vi-VN', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Khung giờ:</span>
                                                <span className="font-medium text-green-600">
                                                    {getSlotTimeRange(selectedAppointment.slot)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Chi phí:</span>
                                                <span className="font-medium text-purple-600">
                                                    {selectedAppointment.serviceTypeId?.price?.toLocaleString('vi-VN')} VNĐ
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thông tin bệnh nhân */}
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                            <UserRound size={16} className="mr-2 text-blue-500" />
                                            Thông tin người đặt
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Họ và tên:</span>
                                                <span className="font-medium text-gray-800">{selectedAppointment.customerId?.name || user?.fullName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Email:</span>
                                                <span className="font-medium text-gray-800">{selectedAppointment.customerId?.email || user?.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Số điện thoại:</span>
                                                <span className="font-medium text-gray-800">{selectedAppointment.customerId?.phone || user?.phone}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Giới tính:</span>
                                                <span className="font-medium text-gray-800">
                                                    {selectedAppointment.customerId?.gender === 0 ? "Nam" :
                                                        selectedAppointment.customerId?.gender === 1 ? "Nữ" : "Không xác định"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hướng dẫn cho xét nghiệm */}
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                            <Info size={16} className="mr-2 text-green-500" />
                                            Hướng dẫn xét nghiệm
                                        </h4>
                                        <ul className="text-xs text-gray-700 space-y-1">
                                            <li className="flex items-start">
                                                <div className="min-w-[4px] h-1 mt-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                                <span>Nhịn ăn 8-12 giờ trước khi lấy máu (nếu có yêu cầu)</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="min-w-[4px] h-1 mt-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                                <span>Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="min-w-[4px] h-1 mt-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                                <span>Mang theo CMND/CCCD và thẻ BHYT (nếu có)</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="min-w-[4px] h-1 mt-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                                <span>Xuất trình mã QR này cho nhân viên tiếp đón khi đến xét nghiệm</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer actions */}
                        <div className="mt-2 border-t border-gray-100 pt-4 flex justify-between p-6">
                            <div className="space-x-2">
                                {/* THÊM: Nút đánh giá khi đã hoàn thành */}
                                {canRateAppointment(selectedAppointment) && selectedAppointment.consultantId && (
                                    <button
                                        onClick={() => {
                                            closeDetailModal();
                                            openRatingModal(selectedAppointment);
                                        }}
                                        className="px-4 py-2 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-100 flex items-center"
                                    >
                                        <Star size={16} className="mr-1.5" />
                                        Đánh giá bác sĩ
                                    </button>
                                )}

                                {/* Nút hủy lịch hẹn */}
                                {canCancelAppointment(selectedAppointment.status) && (
                                    <button
                                        onClick={() => {
                                            closeDetailModal();
                                            openDeleteModal(selectedAppointment);
                                        }}
                                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center"
                                    >
                                        <Trash2 size={16} className="mr-1.5" />
                                        Hủy lịch hẹn
                                    </button>
                                )}
                            </div>

                            {/* Các nút khác */}
                            <div className="flex space-x-3">
                                {/* Nút xem kết quả xét nghiệm cho lịch xét nghiệm đã hoàn thành */}
                                {selectedAppointment.serviceTypeId?.typeCode === 1 && selectedAppointment.status === 2 && (
                                    <button
                                        onClick={() => fetchTestResults(selectedAppointment.customerId?.id, selectedAppointment.id)}
                                        className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 flex items-center"
                                        disabled={loadingResult}
                                    >
                                        {loadingResult ? (
                                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                        ) : (
                                            <FileText size={16} className="mr-1.5" />
                                        )}
                                        Xem kết quả xét nghiệm
                                    </button>
                                )}
                                <button
                                    onClick={closeDetailModal}
                                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal xem kết quả xét nghiệm */}
            {showResultModal && selectedResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Kết quả xét nghiệm</h3>
                            <button
                                onClick={() => setShowResultModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <FileText className="text-blue-600" size={18} />
                                    <h4 className="font-medium text-blue-800">Thông tin xét nghiệm</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                                    <p><span className="text-gray-500">Khách hàng:</span></p>
                                    <p className="font-medium">{selectedResult.customerId?.name}</p>
                                    <p><span className="text-gray-500">Dịch vụ:</span></p>
                                    <p className="font-medium">{selectedResult.serviceBookingId?.serviceTypeId?.name}</p>
                                    <p><span className="text-gray-500">Ngày xét nghiệm:</span></p>
                                    <p className="font-medium">
                                        {selectedResult.serviceBookingId?.appointmentDate
                                            ? new Date(selectedResult.serviceBookingId.appointmentDate).toLocaleDateString('vi-VN')
                                            : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-3">Kết quả chi tiết</h4>
                                <div className="border border-gray-200 rounded-md p-3 bg-white">
                                    <p className="whitespace-pre-wrap">{selectedResult.content}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowResultModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showVideoCall && selectedForCall && (
                <VideoCallManager
                    appointment={selectedForCall}
                    onClose={() => {
                        setShowVideoCall(false);
                        setSelectedForCall(null);
                    }}
                    isConsultant={false} // để phân biệt phía khách hàng
                />
            )}

            <Footer />
        </div>
    );
}