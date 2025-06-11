import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Calendar, Clock, Package, User, AlertCircle, X, Eye, FileText, Stethoscope, Phone, Mail, MapPin } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-gray-50 pt-24 mt-10">
            <Header />
            <div className="container mx-auto px-4 py-8 ">
                <div className="max-w-4xl mx-auto">
                    {/* Lịch khám bệnh */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch khám bệnh</h2>
                        {appointments.medical.length === 0 ? (
                            <p className="text-gray-500">Không có lịch khám bệnh nào</p>
                        ) : (
                            <div className="space-y-4">
                                {appointments.medical.map((booking) => (
                                    <div key={booking.id} className="border rounded-lg p-4 relative">
                                        {booking.status === 'cancelled' && (
                                            <button
                                                onClick={() => handleDeleteMedical(booking.id)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium">{booking.doctor.name}</h3>
                                                <p className="text-sm text-gray-600">Dịch vụ: {booking.service}</p>
                                                <p className="text-sm text-gray-600">
                                                    Ngày: {new Date(booking.date).toLocaleDateString('vi-VN')} - {booking.time}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                                                    {getStatusText(booking.status)}
                                                </span>

                                                <div className="flex space-x-2">
                                                    {/* Thêm nút xem chi tiết */}
                                                    <button
                                                        onClick={() => handleViewDetail(booking)}
                                                        className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                                                        <Eye size={18} />

                                                    </button>
                                                </div>
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleCancelMedical(booking.id)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Hủy lịch
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteMedical(booking.id)}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                >
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Lịch xét nghiệm */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch xét nghiệm</h2>
                        {appointments.test.length === 0 ? (
                            <p className="text-gray-500">Không có lịch xét nghiệm nào</p>
                        ) : (
                            <div className="space-y-4">
                                {appointments.test.map((booking) => (
                                    <div key={booking.id} className="border rounded-lg p-4 relative">
                                        {booking.status === 'cancelled' && (
                                            <button
                                                onClick={() => handleDeleteTest(booking.id)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium">{booking.kit.name}</h3>
                                                <p className="text-sm text-gray-600">{booking.kit.price}</p>
                                                <p className="text-sm text-gray-600">
                                                    Ngày: {new Date(booking.date).toLocaleDateString('vi-VN')} - {booking.time}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                                                    {getStatusText(booking.status)}
                                                </span>
                                                <div className="flex space-x-2">
                                                    {/* Thêm nút xem chi tiết */}
                                                    <button
                                                        onClick={() => handleViewDetail(booking)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleCancelTest(booking.id)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        Hủy lịch
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteTest(booking.id)}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                >
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Các nút tác vụ */}
                    <div className="flex justify-center space-x-4">
                        <Link to="/appointment" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Đặt lịch khám
                        </Link>
                        <Link to="/test" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Đặt lịch xét nghiệm
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal chi tiết lịch hẹn */}
            {showDetailModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Chi tiết lịch {selectedAppointment.kit ? 'xét nghiệm' : 'khám'}
                                </h3>
                                <button
                                    onClick={closeDetailModal}
                                    className="text-gray-500 hover:text-gray-700"
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
                                        <div className="flex items-center space-x-2">
                                            <Clock className="text-blue-500 flex-shrink-0" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Thời gian</p>
                                                <p className="text-sm text-gray-600">{selectedAppointment.time}</p>
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