import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, UserCheck, X } from 'lucide-react';
import Navigation from '../Nav/Navigation';
import Footer from '../Footer/Footer';
import LogoGHSMS from '../Logo/LogoGHSMS';
import { doctors } from '../Array/DoctorTeam';
import Header from '../Header/Header';

export default function DatLichKham() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        service: '',
        doctor: '',
        notes: '',
    });




    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [availableDoctors, setAvailableDoctors] = useState([]);

    // Toast notification state - moved from Navigation
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: ''
    });
    const toastTimeoutRef = React.useRef(null);

    // Filter doctors based on selected service
    useEffect(() => {
        if (formData.service) {
            // In a real app, you would filter doctors by their specialties
            // For now, we'll just use all doctors but simulate filtering
            setAvailableDoctors(doctors);
        } else {
            setAvailableDoctors([]);
        }
    }, [formData.service]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Show toast notification - moved from Navigation
    const showLocalToast = (message, type = 'success') => {
        // Clear any existing timeout
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        // Show the toast
        setToast({ show: true, message, type });

        // Auto hide after 5 seconds
        toastTimeoutRef.current = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    // Close toast manually - moved from Navigation
    const closeToast = () => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast(prev => ({ ...prev, show: false }));
    };

    // Clean up any timeouts when component unmounts
    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', formData);

            // Hiển thị toast ở giữa màn hình
            showLocalToast('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'success');

            // Show success toast
            if (window.addNotificationToNav) {
                window.addNotificationToNav('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'success');
            }
            setSubmitting(false);
            setSubmitted(true);

            // Reset form after submission
            setFormData({
                name: '',
                phone: '',
                email: '',
                date: '',
                time: '',
                service: '',
                doctor: '',
                notes: '',
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
            <Header />

            {/* Banner */}
            <div className="w-full bg-indigo-500 text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <h1 className="text-4xl font-bold mt-2">Đặt Lịch Khám</h1>
                        <Link
                            to="/"
                            className="inline-flex items-center bg-white text-indigo-700 px-6 py-2 rounded-full font-medium hover:bg-indigo-50 transition-colors mb-1"
                        >
                            Trang Chủ
                        </Link>
                    </div>
                </div>
            </div>

            <main className="flex-grow py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {!submitted ? (
                            <>
                                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin đặt lịch</h2>
                                    <p className="text-gray-600 mb-8">
                                        Vui lòng điền đầy đủ thông tin bên dưới để đặt lịch khám tại Trung tâm Y học Giới tính TPHCM.
                                        Chúng tôi sẽ liên hệ lại để xác nhận lịch hẹn của bạn trong thời gian sớm nhất.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Họ và tên <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Nhập họ và tên"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Số điện thoại <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Phone size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Nhập số điện thoại"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Mail size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Nhập email"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Dịch vụ <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <FileText size={18} className="text-gray-400" />
                                                    </div>
                                                    <select
                                                        name="service"
                                                        value={formData.service}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    >
                                                        <option value="">Chọn dịch vụ</option>
                                                        <option value="tu-van">Tư vấn, trị liệu tình dục</option>
                                                        <option value="tam-ly">Tham vấn và trị liệu tâm lý</option>
                                                        <option value="nam-khoa">Khám và điều trị nam khoa</option>
                                                        <option value="phu-khoa">Khám và điều trị phụ khoa</option>
                                                        <option value="phau-thuat">Phẫu thuật tạo hình thẩm mỹ vùng kín</option>
                                                        <option value="stis">Khám và điều trị STIs</option>
                                                        <option value="lgbt">Chăm sóc sức khỏe cộng đồng LGBT+</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Doctor selection - only shown after service is selected */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Bác sĩ {formData.service && <span className="text-red-500">*</span>}
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <UserCheck size={18} className="text-gray-400" />
                                                    </div>
                                                    <select
                                                        name="doctor"
                                                        value={formData.doctor}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        required={formData.service !== ''}
                                                        disabled={!formData.service}
                                                    >
                                                        <option value="">
                                                            {!formData.service
                                                                ? 'Vui lòng chọn dịch vụ trước'
                                                                : 'Chọn bác sĩ'}
                                                        </option>
                                                        {availableDoctors.map(doctor => (
                                                            <option key={doctor.id} value={doctor.id}>
                                                                {doctor.title} {doctor.name} - {doctor.specialty || 'Chuyên khoa đa dạng'}
                                                            </option>
                                                        ))}
                                                        <option value="any">Bất kỳ bác sĩ nào có thể tư vấn</option>
                                                    </select>
                                                </div>
                                                {formData.service && !formData.doctor && (
                                                    <p className="text-xs text-indigo-600 mt-1">
                                                        Chọn bác sĩ bạn muốn gặp hoặc chọn "Bất kỳ" nếu không có yêu cầu cụ thể
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Ngày khám mong muốn <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Calendar size={18} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        value={formData.date}
                                                        onChange={handleChange}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Thời gian <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Clock size={18} className="text-gray-400" />
                                                    </div>
                                                    <select
                                                        name="time"
                                                        value={formData.time}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        required
                                                    >
                                                        <option value="">Chọn thời gian</option>
                                                        <option value="08:00">08:00 - 09:00</option>
                                                        <option value="09:00">09:00 - 10:00</option>
                                                        <option value="10:00">10:00 - 11:00</option>
                                                        <option value="11:00">11:00 - 12:00</option>
                                                        <option value="13:30">13:30 - 14:30</option>
                                                        <option value="14:30">14:30 - 15:30</option>
                                                        <option value="15:30">15:30 - 16:30</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ghi chú
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                rows="4"
                                                placeholder="Nhập triệu chứng, yêu cầu hoặc thông tin khác mà bạn muốn chia sẻ với bác sĩ"
                                            ></textarea>
                                        </div>

                                        {formData.doctor && formData.service && (
                                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                                <h4 className="font-medium text-indigo-800 mb-2">Thông tin bác sĩ</h4>
                                                {formData.doctor !== 'any' ? (
                                                    <div className="flex items-start">
                                                        {availableDoctors.map(doctor => {
                                                            if (doctor.id.toString() === formData.doctor) {
                                                                return (
                                                                    <div key={doctor.id} className="flex">
                                                                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                                                                            <img
                                                                                src={doctor.image || `https://placehold.co/100x100/667eea/ffffff?text=${doctor.name.charAt(0)}`}
                                                                                alt={doctor.name}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-gray-800">{doctor.title} {doctor.name}</p>
                                                                            <p className="text-sm text-gray-600">{doctor.specialty || 'Chuyên khoa đa dạng'}</p>
                                                                            <p className="text-xs text-gray-500 mt-1">{doctor.description}</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-700">
                                                        Bạn đã chọn để gặp bất kỳ bác sĩ nào có thể tư vấn. Chúng tôi sẽ sắp xếp bác sĩ phù hợp nhất với dịch vụ bạn đã chọn.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className={`w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors
                                                    ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                {submitting ? (
                                                    <span className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Đang xử lý...
                                                    </span>
                                                ) : (
                                                    'Gửi đi'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Lưu ý khi đặt lịch</h3>
                                    <ul className="space-y-2 text-blue-700">
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục đăng ký.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Mang theo giấy tờ tùy thân và kết quả xét nghiệm (nếu có).</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Nhân viên tư vấn sẽ liên hệ để xác nhận lịch hẹn của bạn trong vòng 24 giờ.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Lịch của các bác sĩ có thể thay đổi, chúng tôi sẽ thông báo nếu có bất kỳ thay đổi nào.</span>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} className="text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặt lịch thành công!</h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Cảm ơn bạn đã đặt lịch khám tại Trung tâm Y học Giới tính TPHCM.
                                    Chúng tôi sẽ liên hệ lại với bạn để xác nhận lịch hẹn trong thời gian sớm nhất.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Link to="/" className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 transition-colors">
                                        Về trang chủ
                                    </Link>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        Đặt lịch khác
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Toast Notification - moved from Navigation */}
            {toast.show && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className={`
                        max-w-md w-full mx-4 p-4 rounded-lg shadow-lg pointer-events-auto
                        ${toast.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' :
                            toast.type === 'error' ? 'bg-red-100 border-l-4 border-red-500' :
                                'bg-blue-100 border-l-4 border-blue-500'}
                    `}>
                        <div className="flex items-start">
                            {toast.type === 'success' && (
                                <div className="flex-shrink-0 mr-3">
                                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                            {toast.type === 'error' && (
                                <div className="flex-shrink-0 mr-3">
                                    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            )}
                            {toast.type !== 'success' && toast.type !== 'error' && (
                                <div className="flex-shrink-0 mr-3">
                                    <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' :
                                        toast.type === 'error' ? 'text-red-800' :
                                            'text-blue-800'
                                    }`}>
                                    {toast.message}
                                </p>
                            </div>
                            <button
                                className={`ml-4 flex-shrink-0 ${toast.type === 'success' ? 'text-green-500 hover:text-green-700' :
                                        toast.type === 'error' ? 'text-red-500 hover:text-red-700' :
                                            'text-blue-500 hover:text-blue-700'
                                    }`}
                                onClick={closeToast}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}