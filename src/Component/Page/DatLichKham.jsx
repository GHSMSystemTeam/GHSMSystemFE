import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, UserCheck, X } from 'lucide-react';
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
    Star
} from 'lucide-react';
export default function DatLichKham() {
    const { showToast } = useToast()
    const { checkAuthAndShowPrompt } = useAuthCheck();
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1);
    const [consultingService, setConsultingService] = useState(null);
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

    // Fetch service types and find the consulting one
    useEffect(() => {
        const fetchAndSetConsultingService = async () => {
            try {
                const response = await api.get('/api/servicetypes/active');
                if (response.data && response.data.length > 0) {
                    // Find the consulting service. Adjust 'Tư vấn' if the name is different.
                    let service = response.data.find(s => s.name.toLowerCase().includes('tư vấn'));
                    
                    // Fallback to the first active service if not found
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
        time: '',
        service: '',
        doctor: '',
        notes: '',
    });


    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [availableDoctors, setAvailableDoctors] = useState([
        {
            id: 1,
            title: "TS.BS",
            name: "Nguyễn Văn Minh",
            specialty: "Phụ khoa - Sản khoa",
            description: "Chuyên điều trị các bệnh phụ khoa, tư vấn sức khỏe sinh sản",
            experience: "20 năm",
            rating: 4.9,
            reviews: 245,
            education: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
            image: "/images/doctors/doctor1.jpg",
            languages: ["Tiếng Việt", "English"],
            workingDays: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 6"],
            consultationFee: "500,000 VNĐ"
        },
        {
            id: 2,
            title: "TS.BS",
            name: "Trần Thị Hồng",
            specialty: "Nam khoa - Tiết niệu",
            description: "Chuyên gia hàng đầu về sức khỏe nam giới và rối loạn tiết niệu",
            experience: "18 năm",
            rating: 4.8,
            reviews: 198,
            education: "Tiến sĩ Y khoa - Đại học Y TP.HCM",
            image: "/images/doctors/doctor2.jpg",
            languages: ["Tiếng Việt", "English"],
            workingDays: ["Thứ 2", "Thứ 4", "Thứ 5", "Thứ 7"],
            consultationFee: "450,000 VNĐ"
        },
        {
            id: 3,
            title: "BS.CKI",
            name: "Lê Văn Thành",
            specialty: "Nội tiết - Chuyển hóa",
            description: "Chuyên điều trị rối loạn hormone, tiểu đường, tuyến giáp",
            experience: "15 năm",
            rating: 4.7,
            reviews: 156,
            education: "Bác sĩ Chuyên khoa I - Đại học Y Cần Thơ",
            image: "/images/doctors/doctor3.jpg",
            languages: ["Tiếng Việt"],
            workingDays: ["Thứ 3", "Thứ 5", "Thứ 6", "Chủ nhật"],
            consultationFee: "400,000 VNĐ"
        },
        {
            id: 4,
            title: "TS.BS",
            name: "Phạm Thị Lan",
            specialty: "Tâm lý học - Tình dục học",
            description: "Tư vấn tâm lý, trị liệu tình dục, hỗ trợ sức khỏe tinh thần",
            experience: "12 năm",
            rating: 4.8,
            reviews: 134,
            education: "Tiến sĩ Tâm lý học - Đại học Khoa học Xã hội và Nhân văn",
            image: "/images/doctors/doctor4.jpg",
            languages: ["Tiếng Việt", "English", "Français"],
            workingDays: ["Thứ 2", "Thứ 4", "Thứ 6", "Thứ 7"],
            consultationFee: "600,000 VNĐ"
        },
        {
            id: 5,
            title: "BS.CKI",
            name: "Hoàng Văn Đức",
            specialty: "Phẫu thuật thẩm mỹ vùng kín",
            description: "Chuyên phẫu thuật tạo hình và thẩm mỹ vùng sinh dục",
            experience: "16 năm",
            rating: 4.9,
            reviews: 89,
            education: "Bác sĩ Chuyên khoa I - Đại học Y Huế",
            image: "/images/doctors/doctor5.jpg",
            languages: ["Tiếng Việt", "English"],
            workingDays: ["Thứ 3", "Thứ 5", "Thứ 7"],
            consultationFee: "800,000 VNĐ"
        },
        {
            id: 6,
            title: "BS.CKI",
            name: "Võ Thị Mai",
            specialty: "Da liễu - STIs",
            description: "Chuyên điều trị bệnh da liễu và nhiễm trùng lây truyền qua đường tình dục",
            experience: "14 năm",
            rating: 4.6,
            reviews: 167,
            education: "Bác sĩ Chuyên khoa I - Đại học Y Dược TP.HCM",
            image: "/images/doctors/doctor6.jpg",
            languages: ["Tiếng Việt"],
            workingDays: ["Thứ 2", "Thứ 3", "Thứ 5", "Thứ 6"],
            consultationFee: "350,000 VNĐ"
        },
        {
            id: 7,
            title: "TS.BS",
            name: "Nguyễn Thị Bích",
            specialty: "Chăm sóc LGBT+ ",
            description: "Chuyên gia tư vấn và chăm sóc sức khỏe cộng đồng LGBT+",
            experience: "10 năm",
            rating: 4.8,
            reviews: 112,
            education: "Tiến sĩ Y khoa - Đại học Y khoa Phạm Ngọc Thạch",
            image: "/images/doctors/doctor7.jpg",
            languages: ["Tiếng Việt", "English"],
            workingDays: ["Thứ 4", "Thứ 6", "Thứ 7", "Chủ nhật"],
            consultationFee: "550,000 VNĐ"
        },
        {
            id: 8,
            title: "BS.CKI",
            name: "Trần Văn Hùng",
            specialty: "Sinh sản - Hiếm muộn",
            description: "Chuyên điều trị vô sinh hiếm muộn, hỗ trợ sinh sản",
            experience: "13 năm",
            rating: 4.7,
            reviews: 203,
            education: "Bác sĩ Chuyên khoa I - Đại học Y Thái Bình",
            image: "/images/doctors/doctor8.jpg",
            languages: ["Tiếng Việt"],
            workingDays: ["Thứ 2", "Thứ 4", "Thứ 6"],
            consultationFee: "650,000 VNĐ"
        }
    ]);

    // Toast notification state - moved from Navigation
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: ''
    });
    const toastTimeoutRef = React.useRef(null);

    // Filter doctors based on selected service
    {/*
    useEffect(() => {
        if (formData.service) {
            // In a real app, you would filter doctors by their specialties
            // For now, we'll just use all doctors but simulate filtering
            setAvailableDoctors(doctors);
        } else {
            setAvailableDoctors([]);
        }
    }, [formData.service]);
    */}
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkAuthAndShowPrompt('đặt lịch khám')) return;
        if (!consultingService) {
            showToast('Dịch vụ tư vấn chưa được tải, vui lòng thử lại.', 'error');
            return;
        }
        setSubmitting(true);

        // Find the selected doctor object
        const selectedDoctor =
            formData.doctor === 'any'
                ? null
                : availableDoctors.find(d => d.id.toString() === formData.doctor);

        // Prepare booking payload for API using the fixed consulting service
        const bookingPayload = {
            consultantId: selectedDoctor ? selectedDoctor.id.toString() : null,
            customerId: user?.id?.toString(),
            serviceTypeId: consultingService.id, // Use the ID from the consultingService state
            appointmentDate: formData.date ? new Date(formData.date).toISOString() : null,
            appointmentSlot: 0,
            duration: 0
        };

        try {
            await api.post('/api/servicebooking', bookingPayload);

            // Lưu vào localStorage (optional, for your UI)
            const existingBookings = JSON.parse(localStorage.getItem('medicalBookings') || '[]');
            const newBooking = {
                id: Date.now(),
                type: 'medical',
                service: consultingService.name,
                date: formData.date,
                time: formData.time,
                userInfo: {
                    name: user.fullName,
                    phone: user.phone,
                    email: user.email
                },
                doctor: formData.doctor !== 'any'
                    ? availableDoctors.find(d => d.id.toString() === formData.doctor)
                    : { name: 'Bất kỳ' },
                notes: formData.notes,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('medicalBookings', JSON.stringify([...existingBookings, newBooking]));

            // Thêm thông báo vào Navigation
            const notification = `Đặt lịch khám thành công: ${consultingService.name} vào ngày ${formData.date}`;
            const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            const newNotification = {
                id: Date.now(),
                message: notification,
                type: 'success',
                timestamp: new Date(),
                read: false
            };
            localStorage.setItem('notifications', JSON.stringify([newNotification, ...savedNotifications]));

            setSubmitting(false);
            setSubmitted(true);
            showToast('Đặt lịch khám thành công!', 'success');
        } catch (error) {
            setSubmitting(false);
            showToast('Có lỗi xảy ra khi đặt lịch!', 'error');
        }
    };

    const steps = [
        { id: 1, title: "Chọn bác sĩ", desc: "Tìm bác sĩ chuyên khoa" },
        { id: 2, title: "Thông tin", desc: "Hoàn tất thông tin" },
        { id: 3, title: "Xác nhận", desc: "Xác nhận đặt lịch" }
    ];

    const location = useLocation();

    useEffect(() => {
        if (location.state?.selectedDoctorId && location.state?.fromDoctorSelection) {
            setFormData(prev => ({
                ...prev,
                doctor: location.state.selectedDoctorId.toString()
            }));
            setCurrentStep(2); // Chuyển đến bước 2 (nhập thông tin)
        }
    }, [location.state]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-100 to-blue-50 pt-24 mt-10">
            <Header />

            {/* Professional Header */}
            <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold">Đặt Lịch Khám Chuyên Khoa</h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                            Hệ thống chăm sóc sức khỏe giới tính chuyên nghiệp với đội ngũ bác sĩ giàu kinh nghiệm
                        </p>
                        <div className="flex items-center justify-center space-x-8 mt-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold">1000+</div>
                                <div className="text-sm text-indigo-200">Bệnh nhân hài lòng</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">24/7</div>
                                <div className="text-sm text-indigo-200">Hỗ trợ tư vấn</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">15+</div>
                                <div className="text-sm text-indigo-200">Năm kinh nghiệm</div>
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
                                                        {currentStep === 1 && "Chọn bác sĩ"}
                                                        {currentStep === 2 && "Thông tin cá nhân"}
                                                        {currentStep === 3 && "Xác nhận đặt lịch"}
                                                    </h2>
                                                    <p className="text-gray-600 mt-1">
                                                        {currentStep === 1 && "Chọn bác sĩ chuyên khoa phù hợp"}
                                                        {currentStep === 2 && "Hoàn tất thông tin để đặt lịch"}
                                                        {currentStep === 3 && "Kiểm tra và xác nhận thông tin"}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                    Bước {currentStep}/3
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Body */}
                                        <div className="p-8">
                                            {currentStep === 1 && (
                                                <div className="space-y-4">
                                                    {availableDoctors.map((doctor) => (
                                                        <div
                                                            key={doctor.id}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, doctor: doctor.id.toString() }));
                                                                setCurrentStep(2);
                                                            }}
                                                            className={`p-6 border rounded-xl cursor-pointer transition-all hover:shadow-md ${formData.doctor === doctor.id.toString()
                                                                ? 'border-indigo-500 bg-indigo-50'
                                                                : 'border-gray-200 hover:border-indigo-300'
                                                                }`}
                                                        >
                                                            <div className="flex items-start space-x-4">
                                                                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                                                    {doctor.image ? (
                                                                        <img
                                                                            src={doctor.image}
                                                                            alt={doctor.name}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.target.style.display = 'none';
                                                                                e.target.nextSibling.style.display = 'flex';
                                                                            }}
                                                                        />
                                                                    ) : null}
                                                                    <User className="text-indigo-600" size={28} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="flex-1">
                                                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                                                {doctor.title} {doctor.name}
                                                                            </h3>
                                                                            <p className="text-indigo-600 font-medium text-sm">{doctor.specialty}</p>
                                                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{doctor.description}</p>
                                                                        </div>
                                                                        <div className="text-right ml-4">
                                                                            <div className="text-lg font-bold text-indigo-600">{doctor.consultationFee}</div>
                                                                            <div className="text-xs text-gray-500">Phí tư vấn</div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center space-x-4 mt-3">
                                                                        <div className="flex items-center space-x-1">
                                                                            <Star className="text-yellow-400 fill-current" size={16} />
                                                                            <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                                                                            <span className="text-xs text-gray-500">({doctor.reviews} đánh giá)</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-1">
                                                                            <Stethoscope className="text-gray-400" size={14} />
                                                                            <span className="text-xs text-gray-600">{doctor.experience} kinh nghiệm</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-3">
                                                                        <div className="text-xs text-gray-600 mb-1">
                                                                            <strong>Học vấn:</strong> {doctor.education}
                                                                        </div>
                                                                        <div className="text-xs text-gray-600 mb-1">
                                                                            <strong>Ngôn ngữ:</strong> {doctor.languages.join(', ')}
                                                                        </div>
                                                                        <div className="text-xs text-gray-600">
                                                                            <strong>Lịch làm việc:</strong> {doctor.workingDays.join(', ')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <ArrowRight className="text-gray-400 flex-shrink-0" size={20} />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Option to select "Any Doctor" */}
                                                    <div
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, doctor: 'any' }));
                                                            setCurrentStep(2);
                                                        }}
                                                        className={`p-6 border rounded-xl cursor-pointer transition-all hover:shadow-md ${formData.doctor === 'any'
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-gray-200 hover:border-indigo-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                                                <Users className="text-gray-600" size={32} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold text-gray-900 text-lg">Bất kỳ bác sĩ nào</h3>
                                                                <p className="text-sm text-gray-600">Chúng tôi sẽ sắp xếp bác sĩ phù hợp nhất cho bạn</p>
                                                                <div className="mt-2">
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                        Linh hoạt lịch hẹn
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <ArrowRight className="text-gray-400" size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {currentStep === 2 && (
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
                                                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    required
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Chúng tôi sẽ liên hệ để xác nhận giờ khám cụ thể
                                                            </p>
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Ghi chú
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
                                                                <span className="text-gray-600">Bác sĩ:</span>
                                                                <span className="text-gray-900 font-medium">
                                                                    {formData.doctor === 'any'
                                                                        ? 'Bất kỳ bác sĩ'
                                                                        : availableDoctors.find(d => d.id.toString() === formData.doctor)?.name
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Ngày khám:</span>
                                                                <span className="text-gray-900 font-medium">{formData.date || 'Chưa chọn'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between pt-6">
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentStep(1)}
                                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            Quay lại
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={submitting || !formData.date}
                                                            className={`px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2 ${submitting || !formData.date ? 'opacity-70 cursor-not-allowed' : ''
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
                                                        Chọn bác sĩ để tiếp tục
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
                                        Cảm ơn bạn đã đặt lịch khám tại Trung tâm Y học Giới tính TPHCM.
                                        Chúng tôi sẽ liên hệ lại với bạn để xác nhận lịch hẹn trong thời gian sớm nhất.
                                    </p>

                                    <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                                        <h4 className="font-semibold text-gray-900 mb-4">Thông tin lịch hẹn</h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Bác sĩ:</span>
                                                <span className="text-gray-900 font-medium">
                                                    {formData.doctor === 'any'
                                                        ? 'Bất kỳ bác sĩ'
                                                        : availableDoctors.find(d => d.id.toString() === formData.doctor)?.name
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ngày khám:</span>
                                                <span className="text-gray-900 font-medium">{formData.date}</span>
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
                                            onClick={() => {
                                                setSubmitted(false);
                                                setCurrentStep(1);
                                                setFormData({
                                                    name: user?.fullName || '',
                                                    phone: user?.phone || '',
                                                    email: user?.email || '',
                                                    date: '',
                                                    time: '',
                                                    service: '',
                                                    doctor: '',
                                                    notes: '',
                                                });
                                            }}
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
                                            <span className="text-sm">Thông tin bệnh nhân được bảo mật tuyệt đối.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Toast Notification - moved from Navigation
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
            )} */}

            <Footer />
        </div>
    );
}