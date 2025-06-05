import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Calendar, Clock, Package, User, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserAppointments() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState({ medical: [], test: [] });

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
<<<<<<< HEAD
        <div className="min-h-screen bg-gray-50 pt-24 mt-10">
=======
        <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-50 pt-24">
>>>>>>> 1d9a8304431bf69decacf69a650e1375ce9d482b
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
                                    <div key={booking.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium">{booking.doctor.name}</h3>
                                                <p className="text-sm text-gray-600">Dịch vụ: {booking.service}</p>
                                                <p className="text-sm text-gray-600">
                                                    Ngày: {new Date(booking.date).toLocaleDateString('vi-VN')} - {booking.time}
                                                </p>
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                                                    {getStatusText(booking.status)}
                                                </span>
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
                                    <div key={booking.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-medium">{booking.kit.name}</h3>
                                                <p className="text-sm text-gray-600">{booking.kit.price}</p>
                                                <p className="text-sm text-gray-600">
                                                    Ngày: {new Date(booking.date).toLocaleDateString('vi-VN')} - {booking.time}
                                                </p>
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                                                    {getStatusText(booking.status)}
                                                </span>
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
            <Footer />
        </div>
    );
}