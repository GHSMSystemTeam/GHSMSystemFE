import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Calendar, Clock, Package, User, AlertCircle, X, Eye, FileText, Stethoscope, Phone, Mail, MapPin, Plus, CheckCircle, XCircle, Search, ChevronDown, Grid, List, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';

export default function UserAppointments() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState({ medical: [], test: [] });
    const { showToast } = useToast();

    // State mới để lưu chi tiết lịch hẹn đang xem và trạng thái modal
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Hàm xem chi tiết lịch hẹn
    const handleViewDetail = (appointment) => {
        setSelectedAppointment(appointment)
        setShowDetailModal(true)
    }

    // Hàm đóng modal chi tiết
    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedAppointment(null);
    }

    // Thêm hai hàm xử lý hủy lịch riêng biệt
    const handleCancelMedical = (bookingId) => {
        try {
            const allBookings = JSON.parse(localStorage.getItem('medicalBookings') || '[]');
            const updatedBookings = allBookings.map(booking =>
                booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
            );

            localStorage.setItem('medicalBookings', JSON.stringify(updatedBookings));
            loadUserAppointments(); // Tải lại danh sách
        } catch (error) {
            showToast('Có lỗi xảy ra khi hủy lịch khám', 'error');
        }
    };

    const handleCancelTest = (bookingId) => {
        try {
            const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const updatedBookings = allBookings.map(booking =>
                booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
            );

            localStorage.setItem('bookings', JSON.stringify(updatedBookings));
            loadUserAppointments(); // Tải lại danh sách
        } catch (error) {
            showToast('Có lỗi xảy ra khi hủy lịch xét nghiệm', 'error');
        }
    };

    // Thêm hàm xóa lịch khám
    const handleDeleteMedical = (bookingId) => {
        try {
            const allBookings = JSON.parse(localStorage.getItem('medicalBookings') || '[]');
            const updatedBookings = allBookings.filter(booking => booking.id !== bookingId);

            localStorage.setItem('medicalBookings', JSON.stringify(updatedBookings));
            loadUserAppointments();
        } catch (error) {
            showToast('Có lỗi xảy ra khi xóa lịch khám', 'error');
        }
    };

    // Thêm hàm xóa lịch xét nghiệm
    const handleDeleteTest = (bookingId) => {
        try {
            const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const updatedBookings = allBookings.filter(booking => booking.id !== bookingId);

            localStorage.setItem('bookings', JSON.stringify(updatedBookings));
            loadUserAppointments();
        } catch (error) {
            showToast('Có lỗi xảy ra khi xóa lịch xét nghiệm', 'error');
        }
    };

    const loadUserAppointments = () => {
        try {
            // Lấy lịch khám
            const medicalBookings = JSON.parse(localStorage.getItem('medicalBookings') || '[]')
                .filter(booking => booking.userInfo.email === user.email)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Lấy lịch xét nghiệm
            const testBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
                .filter(booking => booking.userInfo.email === user.email)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setAppointments({
                medical: medicalBookings,
                test: testBookings
            });
        } catch (error) {
            showToast('Có lỗi khi tải lịch hẹn', 'error');
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadUserAppointments();
    }, [user, navigate]);

    // const loadUserBookings = () => {
    //     try {
    //         const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    //         // Lọc ra các booking của user hiện tại và sắp xếp theo thời gian tạo mới nhất
    //         const userBookings = allBookings
    //             .filter(booking => booking.userInfo.email === user.email)
    //             .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    //         setBookings(userBookings);
    //     } catch (error) {
    //         console.error('Error loading bookings:', error);
    //         showToast('Có lỗi khi tải lịch hẹn', 'error');
    //     }
    // };

    // const handleCancelBooking = (bookingId) => {
    //     try {
    //         const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    //         const updatedBookings = allBookings.map(booking =>
    //             booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
    //         );

    //         localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    //         loadUserBookings(); // Tải lại danh sách sau khi cập nhật
    //         showToast('Hủy lịch hẹn thành công', 'success');
    //     } catch (error) {
    //         showToast('Có lỗi xảy ra khi hủy lịch hẹn', 'error');
    //     }
    // };


    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed': return 'Đã xác nhận';
            case 'pending': return 'Chờ xác nhận';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const getStatusColorBg = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-400';
            case 'confirmed': return 'bg-blue-400';
            case 'completed': return 'bg-green-400';
            case 'cancelled': return 'bg-red-400';
            default: return 'bg-gray-400';
        }
    };

    const [viewMode, setViewMode] = useState('cards');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 mt-10">
            <Header />

            <div className="bg-white shadow-sm border-b border-gray-100 pt-24 mt-10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Calendar className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Lịch khám của tôi</h1>
                                <p className="text-gray-600">Quản lý và theo dõi các lịch hẹn của bạn</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                                <User className="text-blue-600" size={16} />
                                <span className="text-blue-800 font-medium">{user?.fullName || 'Người dùng'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 ">
                <div className="max-w-4xl mx-auto">
                    {/* Lịch khám bệnh */}
                    {/* Enhanced Medical Appointments */}
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

                        {appointments.medical.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Stethoscope className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có lịch khám bệnh</h3>
                                <p className="text-gray-600 mb-6">Đặt lịch khám với đội ngũ bác sĩ chuyên nghiệp của chúng tôi</p>
                                <Link
                                    to="/appointment"
                                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
                                >
                                    <Plus size={18} />
                                    <span>Đặt lịch khám ngay</span>
                                </Link>
                            </div>
                        ) : (
                            <div className={viewMode === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                                {appointments.medical.map((booking) => (
                                    <div key={booking.id} className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group relative ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'}`}>
                                        {/* Status Banner */}
                                        <div className={`${viewMode === 'cards' ? 'h-1 w-full' : 'w-1 h-16 mr-4'} ${getStatusColorBg(booking.status)}`}></div>

                                        {booking.status === 'cancelled' && (
                                            <button
                                                onClick={() => handleDeleteMedical(booking.id)}
                                                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}

                                        <div className={viewMode === 'cards' ? 'pt-4' : 'flex-1'}>
                                            {/* Doctor Info */}
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                                                    <Stethoscope className="text-white" size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 text-lg">{booking.doctor.name}</h3>
                                                    <p className="text-sm text-gray-600">{booking.doctor.specialty || 'Bác sĩ chuyên khoa'}</p>
                                                </div>
                                            </div>

                                            {/* Service Info */}
                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Dịch vụ khám</p>

                                            </div>

                                            {/* DateTime */}
                                            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar size={16} className="text-blue-500" />
                                                    <span>{new Date(booking.date).toLocaleDateString('vi-VN', {
                                                        weekday: 'short',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                                {booking.time && (
                                                    <div className="flex items-center space-x-2">
                                                        <Clock size={16} className="text-purple-500" />
                                                        <span>{booking.time}</span>
                                                    </div>
                                                )}
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

                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditAppointment(booking)}
                                                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelMedical(booking.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Hủy lịch"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        </>
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
                    {/* Enhanced Test Appointments */}
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

                        {appointments.test.length === 0 ? (
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
                            <div className={viewMode === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                                {appointments.test.map((booking) => (
                                    <div key={booking.id} className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group relative ${viewMode === 'list' ? 'flex items-center p-4' : 'p-6'}`}>
                                        {/* Status Banner */}
                                        <div className={`${viewMode === 'cards' ? 'h-1 w-full' : 'w-1 h-16 mr-4'} ${getStatusColorBg(booking.status)}`}></div>

                                        {booking.status === 'cancelled' && (
                                            <button
                                                onClick={() => handleDeleteTest(booking.id)}
                                                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}

                                        <div className={viewMode === 'cards' ? 'pt-4' : 'flex-1'}>
                                            {/* Kit Info */}
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                                                    <Package className="text-white" size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 text-lg">{booking.kit.name}</h3>
                                                    <p className="text-sm text-gray-600">{booking.kit.duration}</p>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                                <p className="text-sm font-medium text-purple-800">{booking.kit.price}</p>
                                            </div>

                                            {/* DateTime */}
                                            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar size={16} className="text-blue-500" />
                                                    <span>{new Date(booking.date).toLocaleDateString('vi-VN', {
                                                        weekday: 'short',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>

                                            {/* Tests included (if available) */}
                                            {booking.kit.tests && (
                                                <div className="mb-4">
                                                    <p className="text-xs text-gray-500 mb-2">Bao gồm:</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {booking.kit.tests.slice(0, 3).map((test, index) => (
                                                            <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded text-gray-600">
                                                                {test}
                                                            </span>
                                                        ))}
                                                        {booking.kit.tests.length > 3 && (
                                                            <span className="bg-gray-100 text-xs px-2 py-1 rounded text-gray-600">
                                                                +{booking.kit.tests.length - 3} khác
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

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

                                                    {booking.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancelTest(booking.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Hủy lịch"
                                                        >
                                                            <XCircle size={16} />
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

            {/* Modal chi tiết lịch hẹn */}
            {showDetailModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">
                                    Chi tiết lịch {selectedAppointment.kit ? 'xét nghiệm' : 'khám'}
                                </h3>
                                <button
                                    onClick={closeDetailModal}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Hiển thị thông tin chung */}
                                <div className={`px-4 py-2 rounded-md ${getStatusColor(selectedAppointment.status)} inline-block`}>
                                    {getStatusText(selectedAppointment.status)}
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Thông tin lịch hẹn</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="text-blue-500 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Ngày hẹn</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(selectedAppointment.date).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin dịch vụ khám/gói xét nghiệm */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">
                                        {selectedAppointment.kit ? 'Gói xét nghiệm' : 'Dịch vụ khám'}
                                    </h4>
                                    {selectedAppointment.kit ? (
                                        <div>
                                            <p className="font-medium text-gray-800">{selectedAppointment.kit.name}</p>
                                            <p className="text-sm text-gray-600">{selectedAppointment.kit.price}</p>
                                            <p className="text-sm text-gray-600">Thời gian: {selectedAppointment.kit.duration}</p>
                                            {selectedAppointment.kit.tests && (
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium text-gray-600">Bao gồm:</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {selectedAppointment.kit.tests.map((test, index) => (
                                                            <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded">
                                                                {test}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-start space-x-2">
                                            <FileText className="text-indigo-500 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {selectedAppointment.service === 'tu-van' && 'Tư vấn, trị liệu tình dục'}
                                                    {selectedAppointment.service === 'tam-ly' && 'Tham vấn và trị liệu tâm lý'}
                                                    {selectedAppointment.service === 'nam-khoa' && 'Khám và điều trị nam khoa'}
                                                    {selectedAppointment.service === 'phu-khoa' && 'Khám và điều trị phụ khoa'}
                                                    {selectedAppointment.service === 'phau-thuat' && 'Phẫu thuật tạo hình thẩm mỹ vùng kín'}
                                                    {selectedAppointment.service === 'stis' && 'Khám và điều trị STIs'}
                                                    {selectedAppointment.service === 'lgbt' && 'Chăm sóc sức khỏe cộng đồng LGBT+'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Thông tin bác sĩ (chỉ hiển thị cho lịch khám) */}
                                {!selectedAppointment.kit && selectedAppointment.doctor && (
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">Thông tin bác sĩ</h4>
                                        <div className="flex items-start space-x-3">
                                            <Stethoscope className="text-green-500 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {selectedAppointment.doctor.name}
                                                </p>
                                                {selectedAppointment.doctor.specialty && (
                                                    <p className="text-sm text-gray-600">
                                                        {selectedAppointment.doctor.specialty}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Thông tin người đặt lịch */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Thông tin cá nhân</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <User className="text-gray-500 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Họ và tên</p>
                                                <p className="text-sm text-gray-600">{selectedAppointment.userInfo.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="text-gray-500 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Số điện thoại</p>
                                                <p className="text-sm text-gray-600">{selectedAppointment.userInfo.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="text-gray-500 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Email</p>
                                                <p className="text-sm text-gray-600">{selectedAppointment.userInfo.email}</p>
                                            </div>
                                        </div>
                                        {selectedAppointment.userInfo.address && (
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="text-gray-500 flex-shrink-0" size={18} />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Địa chỉ</p>
                                                    <p className="text-sm text-gray-600">{selectedAppointment.userInfo.address}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Ghi chú (Nếu có) */}
                                {selectedAppointment.notes && (
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">Ghi chú</h4>
                                        <p className="text-sm text-gray-600 italic">
                                            "{selectedAppointment.notes}"
                                        </p>
                                    </div>
                                )}

                                {/* Thông tin thêm */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Thông tin thêm</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>Mã đặt lịch: #{selectedAppointment.id}</p>
                                        <p>Ngày đặt: {new Date(selectedAppointment.createdAt).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Các nút tác vụ */}
                            <div className="mt-6 flex justify-end space-x-3">
                                {selectedAppointment.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            if (selectedAppointment.kit) {
                                                handleCancelTest(selectedAppointment.id);
                                            } else {
                                                handleCancelMedical(selectedAppointment.id);
                                            }
                                            closeDetailModal();
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Hủy lịch
                                    </button>
                                )}
                                <button
                                    onClick={closeDetailModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            <Footer />
        </div>
    );
}