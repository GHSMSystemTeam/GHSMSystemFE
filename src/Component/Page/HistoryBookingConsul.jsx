import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import {
    Calendar, Clock, Star, User, UserRound, Eye, X,
    Stethoscope, FileText, XCircle, Video, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';
import api from '../config/axios';

export default function HistoryBookingConsul() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // State lưu danh sách các booking đã đánh giá
    const [ratedBookingIds, setRatedBookingIds] = useState([]);

    // Rating modal state
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [appointmentToRate, setAppointmentToRate] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [ratingTitle, setRatingTitle] = useState('');
    const [ratingContent, setRatingContent] = useState('');
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

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

    // Lấy lịch sử tư vấn đã hoàn thành từ API
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchCompletedConsultations = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/servicebookings/customer/${user.id}`);
                const allBookings = res.data || [];

                // Lọc ra các lịch tư vấn đã hoàn thành (status = 2 và typeCode = 0)
                const completedConsultations = allBookings.filter(
                    (booking) => booking.status === 2 &&
                        booking.serviceTypeId &&
                        booking.serviceTypeId.typeCode === 0
                );

                setConsultations(completedConsultations);
            } catch (err) {
                showToast('Không thể tải lịch sử tư vấn từ server', 'error');
                console.error("Error fetching consultations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedConsultations();
    }, [user, navigate, showToast]);

    // Lấy danh sách các booking đã đánh giá
    useEffect(() => {
        if (!user || !user.id) return;

        const fetchUserRatings = async () => {
            try {
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

    // Mở modal đánh giá
    const openRatingModal = (consultation) => {
        if (isAlreadyRated(consultation.id)) {
            showToast('Bạn đã đánh giá lịch hẹn này rồi!', 'info');
            return;
        }
        setAppointmentToRate(consultation);
        setShowRatingModal(true);
    };

    // Đóng modal đánh giá và reset form
    const closeRatingModal = () => {
        setShowRatingModal(false);
        setAppointmentToRate(null);
        setRatingValue(5);
        setRatingTitle('');
        setRatingContent('');
    };

    // Hàm xử lý gửi đánh giá
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

    // Render stars cho rating
    const renderStarRating = () => {
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

    // Modal handlers
    const handleViewDetail = (consultation) => {
        setSelectedConsultation(consultation);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedConsultation(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 mt-10">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Tiêu đề và nút quay lại */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Stethoscope className="text-indigo-600" size={20} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Lịch sử tư vấn</h1>
                        </div>

                        <Link to="/appointments" className="flex items-center text-gray-600 hover:text-indigo-600">
                            <ChevronLeft size={18} className="mr-1" />
                            <span>Quay lại lịch hẹn</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    ) : consultations.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Stethoscope className="text-gray-400" size={36} />
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Chưa có lịch sử tư vấn</h3>
                            <p className="text-gray-600 mb-6">Bạn chưa hoàn thành buổi tư vấn nào</p>
                            <Link
                                to="/user-appointments"
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Xem lịch hẹn hiện tại
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {consultations.map((consultation) => (
                                <div
                                    key={consultation.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <div className="flex items-center mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mr-4">
                                                    <Stethoscope size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 text-lg">
                                                        {consultation.serviceTypeId?.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Hoàn thành: {new Date(consultation.appointmentDate).toLocaleDateString('vi-VN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 mt-4">
                                                <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                                                    <User size={14} className="text-blue-600 mr-2" />
                                                    <span className="text-sm text-blue-700">
                                                        {consultation.consultantId?.name || "Không xác định"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center bg-indigo-50 px-3 py-1.5 rounded-full">
                                                    <Clock size={14} className="text-indigo-600 mr-2" />
                                                    <span className="text-sm text-indigo-700">
                                                        {getSlotTimeRange(consultation.slot)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full">
                                                    <Calendar size={14} className="text-green-600 mr-2" />
                                                    <span className="text-sm text-green-700">
                                                        {new Date(consultation.appointmentDate).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 self-end md:self-center">
                                            <button
                                                onClick={() => handleViewDetail(consultation)}
                                                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center transition-colors"
                                            >
                                                <Eye size={16} className="mr-2" />
                                                Chi tiết
                                            </button>

                                            <button
                                                onClick={() => openRatingModal(consultation)}
                                                className={`px-4 py-2 ${isAlreadyRated(consultation.id) ? 'bg-gray-100 text-gray-500' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'} rounded-lg flex items-center transition-colors`}
                                                disabled={isAlreadyRated(consultation.id)}
                                            >
                                                <Star size={16} className="mr-2" />
                                                {isAlreadyRated(consultation.id) ? "Đã đánh giá" : "Đánh giá"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal chi tiết buổi tư vấn */}
            {showDetailModal && selectedConsultation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold flex items-center">
                                    <Stethoscope className="mr-2" size={20} /> Chi tiết buổi tư vấn
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
                            {/* Completed Badge */}
                            <div className="flex justify-center">
                                <div className="px-4 py-2 rounded-full bg-green-100 text-green-800 font-medium text-sm inline-flex items-center">
                                    Hoàn thành
                                </div>
                            </div>

                            {/* Layout - 2 cột */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Cột 1: Thông tin buổi tư vấn */}
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                            <Calendar size={16} className="mr-2 text-blue-500" />
                                            Thông tin buổi tư vấn
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Loại dịch vụ:</span>
                                                <span className="font-medium text-gray-800">{selectedConsultation.serviceTypeId?.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ngày:</span>
                                                <span className="font-medium text-gray-800">
                                                    {new Date(selectedConsultation.appointmentDate).toLocaleDateString('vi-VN', {
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
                                                    {getSlotTimeRange(selectedConsultation.slot)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Chi phí:</span>
                                                <span className="font-medium text-blue-600">
                                                    {selectedConsultation.serviceTypeId?.price?.toLocaleString('vi-VN')} VNĐ
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bác sĩ phụ trách */}
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                            <User size={16} className="mr-2 text-indigo-500" />
                                            Bác sĩ tư vấn
                                        </h4>
                                        <div className="flex items-center mt-2">
                                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white mr-3 shadow-md">
                                                {selectedConsultation.consultantId?.profilePicture?.[0] ? (
                                                    <img
                                                        src={selectedConsultation.consultantId.profilePicture[0]}
                                                        alt={selectedConsultation.consultantId.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <UserRound size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{selectedConsultation.consultantId?.name || "Chưa phân công"}</p>
                                                <p className="text-sm text-gray-600">{selectedConsultation.consultantId?.specialization || "Chuyên khoa chung"}</p>
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
                                            Thông tin người đặt
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Họ và tên:</span>
                                                <span className="font-medium text-gray-800">{selectedConsultation.customerId?.name || user?.fullName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Email:</span>
                                                <span className="font-medium text-gray-800">{selectedConsultation.customerId?.email || user?.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Số điện thoại:</span>
                                                <span className="font-medium text-gray-800">{selectedConsultation.customerId?.phone || user?.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ghi chú */}
                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                            <FileText size={16} className="mr-2 text-amber-500" />
                                            Ghi chú
                                        </h4>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {selectedConsultation.description || "Không có ghi chú từ buổi tư vấn này."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="mt-2 border-t border-gray-100 pt-4 flex justify-end p-6 space-x-3">
                            <button
                                onClick={() => {
                                    closeDetailModal();
                                    !isAlreadyRated(selectedConsultation.id) && openRatingModal(selectedConsultation);
                                }}
                                className={`px-4 py-2 ${isAlreadyRated(selectedConsultation.id) ? 'bg-gray-100 text-gray-500' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'} border rounded-lg flex items-center transition-colors`}
                                disabled={isAlreadyRated(selectedConsultation.id)}
                            >
                                <Star size={16} className="mr-2" />
                                {isAlreadyRated(selectedConsultation.id) ? "Đã đánh giá" : "Đánh giá bác sĩ"}
                            </button>

                            <button
                                onClick={closeDetailModal}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal đánh giá */}
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

                            {/* Cảm nghĩ khách hàng */}
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

            <Footer />
        </div>
    );
}