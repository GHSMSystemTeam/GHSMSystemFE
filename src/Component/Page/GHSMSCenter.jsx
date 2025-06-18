import React from 'react';
import { Phone, Mail, ChevronDown, Search, Calendar, MessageCircle, Users, Award, Clock, Star, Stethoscope, ArrowRight } from 'lucide-react';
import NavItem from '../Nav/NavItem';
import LogoGHSMS from '../Logo/LogoGHSMS';
import ServiceItem from '../Service/ServiceItem';
import CircleIcon from '../Icon/CircleIcon';
import { Link } from 'react-router-dom';
import Navigation from '../Nav/Navigation';
import DoctorTeam from '../Array/DoctorTeam';
import Footer from '../Footer/Footer';
import Service from '../Array/Service';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SlideShow from '../Array/SlideShow';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom'
import '../CSS/GHSMSCenterCSS.css';



export default function GHSMSCenter() {
    const [lastPeriodDate, setLastPeriodDate] = useState('');
    const [periodDuration, setPeriodDuration] = useState(5);
    const [cycleLength, setCycleLength] = useState(28);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [predictions, setPredictions] = useState({});
    const [showTracker, setShowTracker] = useState(false);
    const navigate = useNavigate();
    // Thêm state cho carousel bác sĩ
    const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
    const doctorsPerPage = 4; // Hiển thị 4 bác sĩ mỗi lần

    // Thêm danh sách bác sĩ (lấy từ DatLichKham)
    const featuredDoctors = [
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
    ];

    // Hàm điều hướng carousel
    const nextDoctors = () => {
        const maxIndex = Math.ceil(featuredDoctors.length / doctorsPerPage) - 1;
        setCurrentDoctorIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevDoctors = () => {
        const maxIndex = Math.ceil(featuredDoctors.length / doctorsPerPage) - 1;
        setCurrentDoctorIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
    };

    // Lấy danh sách bác sĩ hiện tại để hiển thị
    const getCurrentDoctors = () => {
        const startIndex = currentDoctorIndex * doctorsPerPage;
        return featuredDoctors.slice(startIndex, startIndex + doctorsPerPage);
    };


    // Hàm xử lý đặt lịch với bác sĩ được chọn
    const handleBookAppointment = (doctorId) => {
        // Chuyển đến trang đặt lịch với thông tin bác sĩ đã chọn
        navigate('/appointment', {
            state: {
                selectedDoctorId: doctorId,
                fromDoctorSelection: true
            }
        });
    };


    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    // Calculate predictions based on last period date
    const calculatePredictions = () => {
        if (!lastPeriodDate) return {};

        const lastDate = new Date(lastPeriodDate);
        const predictions = {};
        // Calculate for next 3 months
        for (let i = 0; i < 90; i++) {
            const currentDate = new Date(lastDate);
            currentDate.setDate(lastDate.getDate() + i);
            const daysSinceLastPeriod = i;
            const cycleDay = (daysSinceLastPeriod % cycleLength) + 1;
            const dateKey = currentDate.toISOString().split('T')[0];

            if (cycleDay <= periodDuration) {
                predictions[dateKey] = 'period';
            } else if (cycleDay >= cycleLength - 3 && cycleDay <= cycleLength) {
                predictions[dateKey] = 'pre-period';
            } else if (cycleDay >= 12 && cycleDay <= 16) {
                predictions[dateKey] = 'ovulation';
            } else if (cycleDay >= 17 && cycleDay <= 26) {
                predictions[dateKey] = 'post-ovulation';
            }
        }
        return predictions;
    }



    const handleTrackNow = () => {
        if (lastPeriodDate && periodDuration && cycleLength) {
            setPredictions(calculatePredictions());
            setShowTracker(true);
        }
    };

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const renderCalendar = (monthOffset = 0) => {
        const month = (currentMonth + monthOffset + 12) % 12;
        const year = currentYear + Math.floor((currentMonth + monthOffset) / 12);
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);
        const days = [];

        // Empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = date.toISOString().split('T')[0];
            const prediction = predictions[dateKey];
            const isToday = date.toDateString() === new Date().toDateString();

            let dayClass = 'w-8 h-8 flex items-center justify-center text-sm rounded-full cursor-pointer hover:bg-gray-100 ';

            if (prediction === 'period') {
                dayClass += 'bg-pink-500 text-white ';
            } else if (prediction === 'pre-period') {
                dayClass += 'bg-orange-400 text-white ';
            } else if (prediction === 'ovulation') {
                dayClass += 'bg-green-500 text-white ';
            } else if (prediction === 'post-ovulation') {
                dayClass += 'bg-purple-400 text-white ';
            }

            if (isToday && !prediction) {
                dayClass += 'border-2 border-blue-500 ';
            }

            days.push(
                <div key={day} className={dayClass}>
                    {day}
                </div>
            )
        }
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <h3 className="text-center font-semibold text-lg mb-6 text-gray-800 flex items-center justify-center">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        {months[month]} {year}
                    </span>
                </h3>
                <div className="grid grid-cols-7 gap-1 mb-3">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-xs font-semibold text-gray-500 h-8 flex items-center justify-center">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        );
    }

    const stats = [
        { number: "10,000+", label: "Bệnh nhân đã điều trị", icon: <Users className="w-8 h-8" /> },
        { number: "15+", label: "Năm kinh nghiệm", icon: <Award className="w-8 h-8" /> },
        { number: "24/7", label: "Hỗ trợ tư vấn", icon: <Clock className="w-8 h-8" /> },
        { number: "98%", label: "Hài lòng", icon: <Star className="w-8 h-8" /> }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10 ">
            <Header />


            <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-10 mt-20">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-purple-400 rounded-full"></div>
                    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 rounded-full"></div>
                </div>


                <div className="container mx-auto px-4 py-16 animate-fade-in delay-100">
                    {/* Welcome Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
                            Chào mừng đến với <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Trung tâm Y học Giới tính TPHCM
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Cung cấp dịch vụ tư vấn và điều trị chuyên nghiệp về sức khỏe giới tính,
                            với đội ngũ bác sĩ giàu kinh nghiệm và công nghệ hiện đại
                        </p>
                    </div>
                    <SlideShow />
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-fade-in delay-200">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow ">
                                <div className="text-blue-600 mb-3 flex justify-center">{stat.icon}</div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                                <div className="text-gray-600 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50">



                <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center">

                    {/* nên chèn ảnh ở đây */}

                    {/* Floating contact buttons */}
                    <div className="fixed right-4 bottom-4 flex flex-col space-y-2 z-50">
                        <button className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                            <MessageCircle size={24} className="text-white" />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" fill="none" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>

                </div>

                {/* Doctor Team Section */}
                <section className="text-center relative bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 animate-fade-in">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-blue-200 text-blue-800 text-sm font-medium shadow">
                                Đội ngũ chuyên gia
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                        Bác sĩ chuyên môn hàng đầu
                                    </span>
                                </h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    Đội ngũ bác sĩ giàu kinh nghiệm, được đào tạo chuyên sâu về y học giới tính,
                                    cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho bạn.
                                </p>
                            </div>
                        </div>

                        {/* Doctors Carousel */}
                        <div className="relative overflow-hidden">
                            {/* Mũi tên trái */}
                            <button
                                onClick={prevDoctors}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white  flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-125 active:scale-90"
                                title="Xem bác sĩ trước"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Mũi tên phải */}
                            <button
                                onClick={nextDoctors}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-125 active:scale-90"
                                title="Xem bác sĩ tiếp theo"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Carousel content */}
                            <div className="flex transition-all duration-500 ease-in-out"
                                style={{
                                    transform: `translateX(-${currentDoctorIndex * 100}%)`
                                }}>
                                {/* Render từng trang bác sĩ */}
                                {Array.from({ length: Math.ceil(featuredDoctors.length / doctorsPerPage) }).map((_, pageIndex) => (
                                    <div key={pageIndex} className="w-full flex-shrink-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 px-16">
                                            {featuredDoctors
                                                .slice(pageIndex * doctorsPerPage, (pageIndex + 1) * doctorsPerPage)
                                                .map((doctor) => (
                                                    <div
                                                        key={doctor.id}
                                                        className="bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:-translate-y-2"
                                                    >
                                                        {/* Doctor Image */}
                                                        <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                                                            {doctor.image ? (
                                                                <img
                                                                    src={doctor.image}
                                                                    alt={doctor.name}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextSibling.style.display = 'flex';
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                                    <Stethoscope className="text-blue-600" size={32} />
                                                                </div>
                                                            </div>

                                                            {/* Rating Badge */}
                                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                                                                <Star className="text-yellow-400 fill-current" size={14} />
                                                                <span className="text-sm font-medium text-gray-800">{doctor.rating}</span>
                                                            </div>
                                                        </div>

                                                        {/* Doctor Info */}
                                                        <div className="p-6">
                                                            <div className="mb-4">
                                                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                                    {doctor.title} {doctor.name}
                                                                </h3>
                                                                <p className="text-blue-600 font-semibold text-sm mb-2">{doctor.specialty}</p>
                                                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                                                    {doctor.description}
                                                                </p>
                                                            </div>

                                                            {/* Experience & Reviews */}
                                                            <div className="flex items-center justify-between mb-4 text-sm">
                                                                <div className="flex items-center space-x-1 text-gray-600">
                                                                    <Clock size={14} />
                                                                    <span>{doctor.experience} KN</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1 text-gray-600">
                                                                    <Users size={14} />
                                                                    <span>{doctor.reviews} đánh giá</span>
                                                                </div>
                                                            </div>

                                                            {/* Consultation Fee */}
                                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                                                <div className="text-center">
                                                                    <p className="text-xs text-gray-500 mb-1">Phí tư vấn</p>
                                                                    <p className="text-lg font-bold text-blue-600">{doctor.consultationFee}</p>
                                                                </div>
                                                            </div>

                                                            {/* Book Appointment Button */}
                                                            <button
                                                                onClick={() => handleBookAppointment(doctor.id)}
                                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group active:scale-95"
                                                            >
                                                                <span>Đặt lịch ngay</span>
                                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dots Indicator */}
                        <div className="flex justify-center space-x-2 mb-8">
                            {Array.from({ length: Math.ceil(featuredDoctors.length / doctorsPerPage) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentDoctorIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentDoctorIndex
                                        ? 'bg-blue-600 w-8'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Service Section - Thêm margin top và padding */}
                <section className="text-center relative bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 py-20 mt-16 animate-fade-in delay-200">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-blue-200 text-blue-800 text-sm font-medium shadow">
                                Dịch vụ
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                        Chăm sóc sức khỏe toàn diện
                                    </span>
                                </h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    Đội ngũ chuyên gia hàng đầu với hơn 15 năm kinh nghiệm,
                                    mang đến dịch vụ y tế chất lượng cao và tư vấn chuyên nghiệp
                                </p>
                            </div>
                        </div>
                        <Service />
                    </div>
                </section>


                <div id="period-tracker" className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20 animate-fade-in delay-300">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <div className="inline-block mb-3 px-4 py-1 rounded-full bg-pink-200 text-pink-800 text-sm font-medium">
                                    Health Tools
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                        Theo dõi chu kỳ kinh nguyệt
                                    </span>
                                </h1>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Quản lý và dự đoán chu kỳ kinh nguyệt của bạn một cách chính xác. Chủ động theo dõi sức khỏe sinh sản.
                                </p>
                            </div>

                            {!showTracker ? (
                                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 overflow-hidden relative border border-pink-100">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-70"></div>

                                    <div className="relative">
                                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">
                                            Tạo lịch theo dõi <span className="text-pink-600">cá nhân hóa</span> cho bạn
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                            <div className="bg-pink-50 rounded-2xl p-6 text-center relative overflow-hidden transform transition-all duration-300 hover:shadow-md">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Calendar size={24} className="text-pink-700" />
                                                    </div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Ngày bắt đầu chu kỳ gần nhất
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={lastPeriodDate}
                                                        onChange={(e) => setLastPeriodDate(e.target.value)}
                                                        className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-center transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="bg-purple-50 rounded-2xl p-6 text-center relative overflow-hidden transform transition-all duration-300 hover:shadow-md">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Calendar size={24} className="text-purple-700" />
                                                    </div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Thời gian kéo dài
                                                    </label>
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <button
                                                            onClick={() => setPeriodDuration(Math.max(1, periodDuration - 1))}
                                                            className="w-10 h-10 rounded-full bg-white text-purple-600 flex items-center justify-center hover:bg-purple-100 border border-purple-200"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-lg font-semibold px-6 py-2.5 bg-white rounded-xl border border-purple-200 min-w-[100px]">
                                                            {periodDuration} Ngày
                                                        </span>
                                                        <button
                                                            onClick={() => setPeriodDuration(periodDuration + 1)}
                                                            className="w-10 h-10 rounded-full bg-white text-purple-600 flex items-center justify-center hover:bg-purple-100 border border-purple-200"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 rounded-2xl p-6 text-center relative overflow-hidden transform transition-all duration-300 hover:shadow-md">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <Clock size={24} className="text-blue-700" />
                                                    </div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                                        Độ dài chu kỳ
                                                    </label>
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <button
                                                            onClick={() => setCycleLength(Math.max(21, cycleLength - 1))}
                                                            className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center hover:bg-blue-100 border border-blue-200"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-lg font-semibold px-6 py-2.5 bg-white rounded-xl border border-blue-200 min-w-[100px]">
                                                            {cycleLength} Ngày
                                                        </span>
                                                        <button
                                                            onClick={() => setCycleLength(cycleLength + 1)}
                                                            className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center hover:bg-blue-100 border border-blue-200"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <button
                                                onClick={handleTrackNow}
                                                disabled={!lastPeriodDate}
                                                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1"
                                            >
                                                Tạo lịch theo dõi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
                                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Lịch chu kỳ của bạn</h2>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setCurrentMonth(currentMonth - 3)}
                                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <ChevronLeft size={18} />
                                                <span>Xem trước</span>
                                            </button>
                                            <button
                                                onClick={() => setCurrentMonth(currentMonth + 3)}
                                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <span>Xem sau</span>
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                        {renderCalendar(-1)}
                                        {renderCalendar(0)}
                                        {renderCalendar(1)}
                                    </div>

                                    {/* Legend */}
                                    <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                                        <h3 className="font-semibold text-gray-700 mb-4">Chú thích</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-5 h-5 bg-pink-500 rounded-full"></div>
                                                <span>Ngày có kinh</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-5 h-5 bg-orange-400 rounded-full"></div>
                                                <span>Giai đoạn tiền kinh</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                                                <span>Rụng trứng</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-5 h-5 bg-purple-400 rounded-full"></div>
                                                <span>Hậu rụng trứng</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg flex-grow">
                                            <p className="text-sm text-yellow-800">
                                                <strong>Lưu ý:</strong> Bộ theo dõi chu kỳ này chỉ mang tính chất tham khảo.
                                                Chu kỳ kinh nguyệt thực tế có thể thay đổi do nhiều yếu tố.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setShowTracker(false);
                                                setLastPeriodDate('');
                                                setPredictions({});
                                            }}
                                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 md:flex-shrink-0"
                                        >
                                            Cập nhật thông tin
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Health Tips Section */}
                            <div className="bg-white rounded-3xl shadow-lg p-8 overflow-hidden">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Lời khuyên về sức khỏe</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-pink-50 rounded-xl p-6 border border-pink-100">
                                        <h4 className="text-lg font-semibold text-pink-700 mb-3">Những ngày có kinh</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 mr-2"></div>
                                                <span>Nghỉ ngơi đầy đủ và tránh làm việc quá sức</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 mr-2"></div>
                                                <span>Uống nhiều nước và duy trì chế độ ăn cân bằng</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 mr-2"></div>
                                                <span>Tránh caffeine và đồ uống có cồn</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                        <h4 className="text-lg font-semibold text-blue-700 mb-3">Giai đoạn rụng trứng</h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                                                <span>Thời điểm tối ưu nếu bạn đang có kế hoạch mang thai</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                                                <span>Chú ý sử dụng biện pháp tránh thai nếu không muốn có thai</span>
                                            </li>
                                            <li className="flex items-start">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                                                <span>Theo dõi sự thay đổi của cơ thể để hiểu rõ hơn về chu kỳ</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </div>

            <Footer />
        </div>
    )
}
