import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Calendar, Clock, Package, User, AlertCircle } from 'lucide-react';

export default function UserAppointments() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Lấy bookings từ localStorage
        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        // Lọc ra các booking của user hiện tại
        const userBookings = allBookings.filter(booking => booking.userInfo.email === user.email);
        setBookings(userBookings);
    }, [user, navigate]);

    const loadUserBookings = () => {
        try {
            const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            // Lọc ra các booking của user hiện tại và sắp xếp theo thời gian tạo mới nhất
            const userBookings = allBookings
                .filter(booking => booking.userInfo.email === user.email)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(userBookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
            showToast('Có lỗi khi tải lịch hẹn', 'error');
        }
    };

    const handleCancelBooking = (bookingId) => {
        try {
            const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const updatedBookings = allBookings.map(booking =>
                booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
            );

            localStorage.setItem('bookings', JSON.stringify(updatedBookings));
            loadUserBookings(); // Tải lại danh sách sau khi cập nhật
            showToast('Hủy lịch hẹn thành công', 'success');
        } catch (error) {
            showToast('Có lỗi xảy ra khi hủy lịch hẹn', 'error');
        }
    };


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
        <div className="min-h-screen bg-gray-50 pt-24">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Lịch hẹn của tôi</h1>
                        <p className="text-gray-600 mb-6">
                            Quản lý và theo dõi các lịch hẹn xét nghiệm của bạn
                        </p>

                        {bookings.length === 0 ? (
                            <div className="text-center py-8">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Bạn chưa có lịch hẹn nào</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-800">{booking.kit.name}</h3>
                                                <p className="text-gray-600">{booking.userInfo.name} - {booking.userInfo.phone}</p>
                                            </div>
                                            <div className="mt-2 md:mt-0">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                                    {getStatusText(booking.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span>{new Date(booking.date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <span>{booking.time}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Package className="w-4 h-4 text-gray-500" />
                                                <span>{booking.kit.price}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                                <span>{booking.kit.duration}</span>
                                            </div>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="mt-4 border-t pt-4">
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Hủy lịch hẹn
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">Lưu ý</h3>
                        <ul className="space-y-2 text-blue-700 text-sm">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                Mang theo CMND/CCCD và giấy tờ liên quan
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                Nhịn ăn 8-12 tiếng trước khi xét nghiệm máu
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                Liên hệ hotline nếu cần thay đổi lịch hẹn
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}