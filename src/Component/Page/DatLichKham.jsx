import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, UserCheck, X, Info } from 'lucide-react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import { useAuth } from '../Auth/AuthContext';
import { useAuthCheck } from '../Auth/UseAuthCheck';
import { useToast } from '../Toast/ToastProvider';
import { useLocation } from 'react-router-dom';
import api from '../config/axios';
import {
    MapPin,
    Stethoscope,
    ArrowRight,
    Heart,
    Shield,
    Users,
    Star,
    Filter
} from 'lucide-react';

export default function DatLichKham() {
    const { showToast } = useToast()
    const { checkAuthAndShowPrompt } = useAuthCheck();
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1);
    const [consultingService, setConsultingService] = useState(null);
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);

    const SPECIALTIES = {
        "Sexology_Andrology": "Y học Giới tính & Nam học",
        "Psychology": "Tư vấn tâm lý",
        "Gynecology": "Phụ khoa",
        "Endocrinology": "Nội tiết",
        "Dermatology": "Da liễu",
        "Obstetrics": "Sản khoa",
        "Urology": "Tiết niệu"
    };

    const getVietnameseSpecialization = (englishValue) => {
        return SPECIALTIES[englishValue] || englishValue;
    };

    // Thời gian tư vấn (mapping từ backend)
    const timeSlots = [
        { value: 1, label: "07:00 - 09:00", display: "07:00 - 09:00" },
        { value: 2, label: "09:00 - 11:00", display: "09:00 - 11:00" },
        { value: 3, label: "11:00 - 13:00", display: "11:00 - 13:00" },
        { value: 4, label: "13:00 - 15:00", display: "13:00 - 15:00" },
        { value: 5, label: "15:00 - 17:00", display: "15:00 - 17:00" },
    ];

    // Cập nhật formData khi có thông tin user
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.fullName || '',
                phone: user.phone || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    // Fetch consulting service (default service type)
    useEffect(() => {
        const fetchAndSetConsultingService = async () => {
            try {
                const response = await api.get('/api/servicetypes/active');
                if (response.data && response.data.length > 0) {
                    let service = response.data.find(s => s.name.toLowerCase().includes('consulting'));
                    if (!service) {
                        service = response.data.find(s => s.name && s.name.toLowerCase().includes('tư vấn'));
                    }
                    if (!service) {
                        service = response.data[0];
                    }
                    setConsultingService(service);
                }
            } catch (error) {
                console.error("Failed to fetch service types:", error);
                showToast('Không thể tải dịch vụ tư vấn.', 'error');
            }
        };
        fetchAndSetConsultingService();
    }, [showToast]);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        doctor: '',
        notes: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Fetch consultants based on selected date and time slot
    const fetchAvailableConsultants = async () => {
        if (!formData.date || !selectedSlot) {
            showToast('Vui lòng chọn ngày và khung giờ trước', 'error');
            return;
        }

        setLoading(true);
        try {
            // Sử dụng API để lấy danh sách các bác sĩ còn trống lịch vào ngày và giờ đã chọn
            const response = await api.get('/api/availableconsultants', {
                params: {
                    bookingDate: formData.date,
                    slot: selectedSlot.value
                }
            });

            // Lọc chỉ hiển thị các bác sĩ active và dữ liệu hợp lệ
            const activeConsultants = response.data
                .filter(c => c.active)
                .filter((consultant, index, self) =>
                    index === self.findIndex(c => c.id === consultant.id)
                );

            setAvailableDoctors(activeConsultants);
            setFilteredDoctors(activeConsultants);

            if (activeConsultants.length === 0) {
                showToast('Không có bác sĩ nào rảnh vào thời gian này, vui lòng chọn thời gian khác', 'info');
            } else {
                setCurrentStep(2);
            }
        } catch (error) {
            console.error("Failed to fetch available consultants:", error);
            showToast('Không thể tải danh sách chuyên gia tư vấn.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkAuthAndShowPrompt('đặt lịch tư vấn')) return;

        if (!consultingService) {
            showToast('Dịch vụ tư vấn chưa được tải, vui lòng thử lại.', 'error');
            return;
        }
        if (!formData.doctor) {
            showToast('Vui lòng chọn tư vấn viên.', 'error');
            return;
        }
        if (!formData.date) {
            showToast('Vui lòng chọn ngày tư vấn.', 'error');
            return;
        }

        // Tránh submit nhiều lần
        if (submitting) return;
        setSubmitting(true);

        const selectedDoctor = availableDoctors.find(d => d.id.toString() === formData.doctor);

        const bookingPayload = {
            consultantId: selectedDoctor?.id || null,
            customerId: user?.id || null,
            serviceTypeId: consultingService?.id || null,
            appointmentDate: formData.date ? new Date(formData.date).toISOString() : null,
            slot: selectedSlot.value,
            duration: 0,
            description: formData.notes || ""
        };

        // Validation
        if (!bookingPayload.consultantId || !bookingPayload.customerId || !bookingPayload.serviceTypeId) {
            setSubmitting(false);
            if (!bookingPayload.consultantId) {
                showToast('Không tìm thấy thông tin tư vấn. Vui lòng chọn lại bác sĩ.', 'error');
            } else if (!bookingPayload.customerId) {
                showToast('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.', 'error');
            } else if (!bookingPayload.serviceTypeId) {
                showToast('Không tìm thấy thông tin dịch vụ tư vấn. Vui lòng tải lại trang.', 'error');
            }
            return;
        }

        try {
            const response = await api.post('/api/servicebooking', bookingPayload);
            console.log('Booking Response:', response.data);

            setSubmitted(true);
            showToast('Đặt lịch tư vấn thành công!', 'success');
        } catch (error) {
            console.error("API Error:", error.response || error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Có lỗi xảy ra khi đặt lịch!';
            showToast(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setSubmitted(false);
        setCurrentStep(1);
        setFormData({
            name: user?.fullName || '',
            phone: user?.phone || '',
            email: user?.email || '',
            date: '',
            doctor: '',
            notes: '',
        });
        setSelectedSlot(null);
        setFilteredDoctors([]);
    };

    // Lọc bác sĩ theo chuyên khoa
    const filterDoctorsBySpecialization = (specialization) => {
        if (!specialization || specialization === 'all') {
            setFilteredDoctors(availableDoctors);
        } else {
            const filtered = availableDoctors.filter(
                doctor => doctor.specialization === specialization
            );
            setFilteredDoctors(filtered);
        }
    };

    const steps = [
        { id: 1, title: "Chọn thời gian", desc: "Chọn ngày và giờ phù hợp" },
        { id: 2, title: "Chọn tư vấn viên", desc: "Chọn tư vấn viên có sẵn" },
        { id: 3, title: "Thông tin", desc: "Hoàn tất thông tin" },
    ];

    // Tạo danh sách các chuyên khoa duy nhất từ danh sách bác sĩ
    const specializations = ['all', ...new Set(availableDoctors
        .map(doctor => doctor.specialization)
        .filter(Boolean)
    )];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-100 to-blue-50 pt-24 mt-10">
            <Header />

            {/* Professional Header */}
            <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold">Đặt Lịch Tư Vấn Chuyên Khoa</h1>
                        <div className="flex items-center justify-center space-x-8 mt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-sm text-indigo-200">Hỗ trợ tư vấn</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-grow py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        {!submitted ? (
                            <div className="grid lg:grid-cols-4 gap-8">
                                {/* Progress Sidebar */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quy trình đặt lịch</h3>

                                        <div className="space-y-4">
                                            {steps.map((step) => (
                                                <div key={step.id} className="flex items-start space-x-3">
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${currentStep >= step.id
                                                        ? 'bg-indigo-600 text-white shadow-lg'
                                                        : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                        {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium transition-colors ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                                                            }`}>
                                                            {step.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{step.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Support Contact */}
                                        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Shield className="text-indigo-600" size={16} />
                                                <span className="text-sm font-medium text-indigo-900">Hỗ trợ 24/7</span>
                                            </div>
                                            <p className="text-xs text-indigo-700 mb-2">
                                                Cần hỗ trợ đặt lịch? Liên hệ ngay
                                            </p>
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2 text-xs text-indigo-700">
                                                    <Phone size={12} />
                                                    <span>1900 1234</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs text-indigo-700">
                                                    <Mail size={12} />
                                                    <span>support@ghsm.com</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs text-indigo-700">
                                                    <MapPin size={12} />
                                                    <span>123 Đường ABC, Q.1, TP.HCM</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="lg:col-span-3">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                        {/* Content Header */}
                                        <div className="px-8 py-6 border-b border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-2xl font-semibold text-gray-900">
                                                        {currentStep === 1 && "Chọn thời gian"}
                                                        {currentStep === 2 && "Chọn tư vấn viên"}
                                                        {currentStep === 3 && "Xác nhận đặt lịch"}
                                                    </h2>
                                                    <p className="text-gray-600 mt-1">
                                                        {currentStep === 1 && "Chọn ngày và khung giờ phù hợp với bạn"}
                                                        {currentStep === 2 && "Chọn tư vấn viên chuyên khoa phù hợp trong danh sách có sẵn"}
                                                        {currentStep === 3 && "Hoàn tất thông tin và xác nhận đặt lịch"}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                    Bước {currentStep}/3
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Body */}
                                        <div className="p-8">
                                            {/* Bước 1: Chọn thời gian */}
                                            {currentStep === 1 && (
                                                <div className="space-y-6">
                                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                                                        <p className="text-blue-800 text-sm flex items-center">
                                                            <Info size={16} className="mr-2" />
                                                            Vui lòng chọn ngày và khung giờ để hệ thống hiển thị danh sách bác sĩ còn trống lịch
                                                        </p>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Ngày tư vấn mong muốn <span className="text-red-500">*</span>
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
                                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Khung giờ tư vấn <span className="text-red-500">*</span>
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Clock size={18} className="text-gray-400" />
                                                                </div>
                                                                <select
                                                                    value={selectedSlot?.value || ''}
                                                                    onChange={(e) => {
                                                                        const slot = timeSlots.find(s => s.value === parseInt(e.target.value));
                                                                        setSelectedSlot(slot);
                                                                    }}
                                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    required
                                                                >
                                                                    <option value="">Chọn khung giờ...</option>
                                                                    {timeSlots.map(slot => (
                                                                        <option key={slot.value} value={slot.value}>
                                                                            {slot.display}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end mt-6">
                                                        <button
                                                            type="button"
                                                            disabled={!formData.date || !selectedSlot || loading}
                                                            onClick={fetchAvailableConsultants}
                                                            className={`px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2 
                                                                ${(!formData.date || !selectedSlot || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    <span>Đang tìm...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span>Tìm bác sĩ có sẵn</span>
                                                                    <ArrowRight size={16} />
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bước 2: Chọn bác sĩ từ danh sách có sẵn */}
                                            {currentStep === 2 && (
                                                <div>
                                                    {/* Hiển thị thông tin đã chọn */}
                                                    <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                                                        <h4 className="font-medium text-indigo-800 mb-2">Thời gian đã chọn</h4>
                                                        <div className="flex items-center space-x-6">
                                                            <div className="flex items-center text-gray-700">
                                                                <Calendar className="mr-2 text-indigo-600" size={16} />
                                                                <span>{formData.date}</span>
                                                            </div>
                                                            <div className="flex items-center text-gray-700">
                                                                <Clock className="mr-2 text-indigo-600" size={16} />
                                                                <span>{selectedSlot?.display}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => setCurrentStep(1)}
                                                                className="text-indigo-600 hover:text-indigo-800 text-xs underline"
                                                            >
                                                                Thay đổi
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Filter by specialization */}
                                                    {availableDoctors.length > 0 && (
                                                        <div className="mb-6">
                                                            <div className="flex items-center space-x-2 mb-3">
                                                                <Filter size={16} className="text-gray-600" />
                                                                <h4 className="font-medium text-gray-800">Lọc theo chuyên khoa:</h4>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {specializations.map(spec => (
                                                                    <button
                                                                        key={spec}
                                                                        onClick={() => filterDoctorsBySpecialization(spec)}
                                                                        className="px-3 py-1.5 rounded-full text-sm transition-colors hover:bg-indigo-100 border
                                                                            hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    >
                                                                        {spec === 'all' ? 'Tất cả chuyên khoa' : getVietnameseSpecialization(spec)}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Danh sách bác sĩ có sẵn */}
                                                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                                                        {filteredDoctors.length === 0 ? (
                                                            <div className="text-center py-8">
                                                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                                    <User className="text-gray-400" size={24} />
                                                                </div>
                                                                <h4 className="text-gray-600 font-medium mb-2">Không có bác sĩ nào có sẵn</h4>
                                                                <p className="text-gray-500 text-sm max-w-md mx-auto">
                                                                    Không có bác sĩ nào rảnh vào thời gian bạn đã chọn. Vui lòng thử chọn thời gian khác.
                                                                </p>
                                                                <button
                                                                    onClick={() => setCurrentStep(1)}
                                                                    className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                                                >
                                                                    Chọn thời gian khác
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            filteredDoctors.map((doctor) => (
                                                                <div
                                                                    key={doctor.id}
                                                                    onClick={() => {
                                                                        setFormData(prev => ({ ...prev, doctor: doctor.id.toString() }));
                                                                        setCurrentStep(3);
                                                                    }}
                                                                    className={`p-6 border rounded-xl cursor-pointer transition-all hover:shadow-md ${formData.doctor === doctor.id.toString()
                                                                        ? 'border-indigo-500 bg-indigo-50'
                                                                        : 'border-gray-200 hover:border-indigo-300'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-start space-x-4">
                                                                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                                                            {doctor.profilePicture && doctor.profilePicture[0] ? (
                                                                                <img
                                                                                    src={doctor.profilePicture[0]}
                                                                                    alt={doctor.name}
                                                                                    className="w-full h-full object-cover"
                                                                                />
                                                                            ) : (
                                                                                <User className="text-indigo-600" size={28} />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="flex items-start justify-between">
                                                                                <div className="flex-1 pr-4">
                                                                                    <h3 className="font-semibold text-gray-900 text-lg break-words whitespace-normal leading-tight">
                                                                                        {doctor.name || 'Tên tư vấn viên'}
                                                                                    </h3>
                                                                                    <p className="text-indigo-600 font-medium text-sm mt-1 break-words">
                                                                                        {getVietnameseSpecialization(doctor.specialization) || 'Chuyên khoa sức khỏe giới tính'}
                                                                                    </p>
                                                                                    <p className="text-gray-600 text-sm mt-2 break-words whitespace-normal">
                                                                                        {doctor.description || 'Tư vấn viên có nhiều năm kinh nghiệm trong lĩnh vực chuyên môn'}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="text-right ml-4 flex-shrink-0">
                                                                                    <div className="text-lg font-bold text-indigo-600">
                                                                                        {doctor.expYear || 0} năm
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-500">Kinh nghiệm</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center space-x-4 mt-3">
                                                                                <div className="flex items-center space-x-1">
                                                                                    <Star className="text-yellow-400 fill-current" size={16} />
                                                                                    <span className="text-sm font-medium text-gray-700">
                                                                                        {doctor.avgRating || 'N/A'}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center space-x-1">
                                                                                    <Stethoscope className="text-gray-400" size={14} />
                                                                                    <span className="text-xs text-gray-600 break-words">
                                                                                        {doctor.licenseDetails || 'Chứng chỉ hành nghề'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <ArrowRight className="text-gray-400 flex-shrink-0" size={20} />
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Bước 3: Thông tin và xác nhận */}
                                            {currentStep === 3 && (
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    <div className="grid md:grid-cols-2 gap-6">
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
                                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                                                    placeholder="Nhập họ và tên"
                                                                    readOnly
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
                                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                                                    placeholder="Nhập số điện thoại"
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-2">
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
                                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                                                    placeholder="Nhập email"
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Lý do cần được tư vấn:
                                                            </label>
                                                            <textarea
                                                                name="notes"
                                                                value={formData.notes}
                                                                onChange={handleChange}
                                                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                rows="4"
                                                                placeholder="Nhập triệu chứng, yêu cầu hoặc thông tin khác mà bạn muốn chia sẻ với bác sĩ"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Appointment Summary */}
                                                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                                        <h4 className="font-semibold text-gray-900 mb-4">Tóm tắt lịch hẹn</h4>
                                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Tư vấn viên:</span>
                                                                <span className="text-gray-900 font-medium text-right break-words max-w-[200px]">
                                                                    {availableDoctors.find(d => d.id.toString() === formData.doctor)?.name || 'Chưa chọn'}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Dịch vụ tư vấn:</span>
                                                                <span className="text-gray-900 font-medium">
                                                                    {consultingService?.name || 'Đang tải...'}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Ngày tư vấn:</span>
                                                                <span className="text-gray-900 font-medium">{formData.date || 'Chưa chọn'}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Khung giờ:</span>
                                                                <span className="text-gray-900 font-medium">{selectedSlot?.display || 'Chưa chọn'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between pt-6">
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentStep(2)}
                                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            Quay lại
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={submitting}
                                                            className={`px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''
                                                                }`}
                                                        >
                                                            {submitting ? (
                                                                <>
                                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    <span>Đang xử lý...</span>
                                                                </>
                                                            ) : (
                                                                <span>Xác nhận đặt lịch</span>
                                                            )}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>

                                        {/* Navigation Footer for step 1 */}
                                        {currentStep === 1 && (
                                            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                                                <div className="flex justify-center">
                                                    <div className="text-sm text-gray-500 self-center">
                                                        Chọn ngày và khung giờ để xem danh sách bác sĩ có sẵn
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle size={40} className="text-green-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Đặt lịch thành công!</h2>
                                    <p className="text-gray-600 mb-8 text-lg">
                                        Cảm ơn bạn đã đặt lịch tư vấn tại Dịch vụ chăm sóc sức khỏe giới tính.
                                        Chúng tôi sẽ liên hệ lại với bạn để xác nhận lịch hẹn trong thời gian sớm nhất.
                                    </p>

                                    <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                                        <h4 className="font-semibold text-gray-900 mb-4">Thông tin lịch hẹn</h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tư vấn viên:</span>
                                                <span className="text-gray-900 font-medium text-right break-words max-w-[250px]">
                                                    {availableDoctors.find(d => d.id.toString() === formData.doctor)?.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ngày khám:</span>
                                                <span className="text-gray-900 font-medium">{formData.date}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Khung giờ:</span>
                                                <span className="text-gray-900 font-medium">{selectedSlot?.display}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Dịch vụ:</span>
                                                <span className="text-gray-900 font-medium">{consultingService?.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Mã đặt lịch:</span>
                                                <span className="text-indigo-600 font-bold">#DL{Date.now().toString().slice(-6)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-4">
                                        <Link
                                            to="/"
                                            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            Về trang chủ
                                        </Link>
                                        <button
                                            onClick={resetForm}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                        >
                                            Đặt lịch khác
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Important Notes Section */}
                        {!submitted && (
                            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                                    <Shield className="mr-2" size={20} />
                                    Lưu ý quan trọng
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <ul className="space-y-3 text-blue-800">
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Nhân viên sẽ liên hệ xác nhận giờ khám trong vòng 24 giờ.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Mang theo giấy tờ tùy thân và kết quả xét nghiệm (nếu có).</span>
                                        </li>
                                    </ul>
                                    <ul className="space-y-3 text-blue-800">
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">Thông tin khách hàng được bảo mật tuyệt đối.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}