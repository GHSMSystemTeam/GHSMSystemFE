import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import {
    Calendar, Clock, ChevronLeft, Eye, X, XCircle,
    Package, FileText, Download, User, UserRound
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';
import api from '../config/axios';

export default function HistoryBookingServiceType() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [testBookings, setTestBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingResult, setLoadingResult] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

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

    // Lấy lịch sử xét nghiệm đã hoàn thành từ API
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchCompletedTests = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/servicebookings/customer/${user.id}`);
                const allBookings = res.data || [];

                // Lọc ra các lịch xét nghiệm đã hoàn thành (status = 2 và typeCode = 1)
                const completedTests = allBookings.filter(
                    (booking) => booking.status === 2 &&
                        booking.serviceTypeId &&
                        booking.serviceTypeId.typeCode === 1
                );

                setTestBookings(completedTests);
            } catch (err) {
                showToast('Không thể tải lịch sử xét nghiệm từ server', 'error');
                console.error("Error fetching test bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedTests();
    }, [user, navigate, showToast]);

    const handleViewDetail = (test) => {
        setSelectedTest(test);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedTest(null);
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

    const downloadResultPdf = async (resultId) => {
        if (!resultId) {
            showToast('Không tìm thấy ID kết quả!', 'error');
            return;
        }
        try {
            const response = await api.get(`/api/result/${resultId}/pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `KetQuaXetNghiem_${resultId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            showToast('Không thể tải file PDF. Vui lòng thử lại!', 'error');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 pt-24 mt-10">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Tiêu đề và nút quay lại */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Package className="text-purple-600" size={20} />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Lịch sử xét nghiệm</h1>
                        </div>

                        <Link to="/appointments" className="flex items-center text-gray-600 hover:text-purple-600">
                            <ChevronLeft size={18} className="mr-1" />
                            <span>Quay lại lịch hẹn</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    ) : testBookings.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="text-gray-400" size={36} />
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Chưa có lịch sử xét nghiệm</h3>
                            <p className="text-gray-600 mb-6">Bạn chưa hoàn thành xét nghiệm nào</p>
                            <Link
                                to="/user-appointments"
                                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Xem lịch hẹn hiện tại
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {testBookings.map((test) => (
                                <div
                                    key={test.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                                        <div className="mb-4 md:mb-0">
                                            <div className="flex items-center mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mr-4">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 text-lg">
                                                        {test.serviceTypeId?.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Hoàn thành: {new Date(test.appointmentDate).toLocaleDateString('vi-VN', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 mt-4">
                                                <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-full">
                                                    <Clock size={14} className="text-purple-600 mr-2" />
                                                    <span className="text-sm text-purple-700">
                                                        {getSlotTimeRange(test.slot)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center bg-pink-50 px-3 py-1.5 rounded-full">
                                                    <Calendar size={14} className="text-pink-600 mr-2" />
                                                    <span className="text-sm text-pink-700">
                                                        {new Date(test.appointmentDate).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3 self-end md:self-center">
                                            <button
                                                onClick={() => handleViewDetail(test)}
                                                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center transition-colors"
                                            >
                                                <Eye size={16} className="mr-2" />
                                                Chi tiết
                                            </button>

                                            <button
                                                onClick={() => fetchTestResults(test.customerId?.id, test.id)}
                                                className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center transition-colors"
                                                disabled={loadingResult}
                                            >
                                                {loadingResult ? (
                                                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                ) : (
                                                    <FileText size={16} className="mr-2" />
                                                )}
                                                Kết quả
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal chi tiết xét nghiệm */}
            {showDetailModal && selectedTest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold flex items-center">
                                    <Package className="mr-2" size={20} /> Chi tiết xét nghiệm
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

                            {/* Thông tin xét nghiệm */}
                            <div className="space-y-4">
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                        <Package size={16} className="mr-2 text-purple-500" />
                                        Thông tin gói xét nghiệm
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tên gói:</span>
                                            <span className="font-medium text-gray-800">{selectedTest.serviceTypeId?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Mô tả:</span>
                                            <span className="font-medium text-gray-800">{selectedTest.serviceTypeId?.description || "Không có mô tả"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ngày hẹn:</span>
                                            <span className="font-medium text-gray-800">
                                                {new Date(selectedTest.appointmentDate).toLocaleDateString('vi-VN', {
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
                                                {getSlotTimeRange(selectedTest.slot)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Chi phí:</span>
                                            <span className="font-medium text-purple-600">
                                                {selectedTest.serviceTypeId?.price?.toLocaleString('vi-VN')} VNĐ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin người đặt */}
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                        <UserRound size={16} className="mr-2 text-blue-500" />
                                        Thông tin người đặt
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Họ và tên:</span>
                                            <span className="font-medium text-gray-800">{selectedTest.customerId?.name || user?.fullName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium text-gray-800">{selectedTest.customerId?.email || user?.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Số điện thoại:</span>
                                            <span className="font-medium text-gray-800">{selectedTest.customerId?.phone || user?.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="mt-2 border-t border-gray-100 pt-4 flex justify-end p-6 space-x-3">
                            <button
                                onClick={() => {
                                    closeDetailModal();
                                    fetchTestResults(selectedTest.customerId?.id, selectedTest.id);
                                }}
                                className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 flex items-center"
                            >
                                <FileText size={16} className="mr-2" />
                                Xem kết quả
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
                        <div className="mt-6 flex justify-between">
                            <button
                                className="px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 flex items-center"
                                onClick={() => downloadResultPdf(selectedResult.id)}
                            >
                                <Download size={16} className="mr-1.5" />
                                Tải PDF
                            </button>

                            <button
                                onClick={() => setShowResultModal(false)}
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
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