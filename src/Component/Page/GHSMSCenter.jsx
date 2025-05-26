import React from 'react';
import { Phone, Mail, ChevronDown, Search, Calendar, MessageCircle, Users, Award, Clock, Star } from 'lucide-react';
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




export default function GHSMSCenter() {
    const [lastPeriodDate, setLastPeriodDate] = useState('');
    const [periodDuration, setPeriodDuration] = useState(5);
    const [cycleLength, setCycleLength] = useState(28);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [predictions, setPredictions] = useState({});
    const [showTracker, setShowTracker] = useState(false);

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
            <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-center font-semibold text-lg mb-4 text-pink-600">
                    {months[month]} {year}
                </h3>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
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
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="mr-4">
                            <LogoGHSMS />
                        </div>
                        <div className="hidden lg:block">
                            <h1 className="text-blue-700 font-semibold text-lg uppercase">Trung tâm Y học Giới tính TPHCM</h1>
                            <p className="text-gray-600 text-sm">Bệnh viện Nam học và Hiếm muộn TPHCM</p>
                            <p className="text-gray-500 text-xs">Center for Sexual Medicine of TPHCM</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-1">
                            <Mail size={16} className="text-blue-600" />
                            <span className="text-sm">ttyhgt@afTPHCM.com</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                            <Phone size={16} className="text-blue-600" />
                            <span className="text-sm">0866249268</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">VN</button>
                            <button className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">EN</button>

                        </div>
                    </div>

                </div>

                {/* Navigation */}
                <Navigation />
            </header>

            <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-purple-400 rounded-full"></div>
                    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 rounded-full"></div>
                </div>


                <div className="container mx-auto px-4 py-16">
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
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
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
                <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
                    {/* <div className="w-full md:w-1/2 md:pr-12 z-10">
                        <h2 className="text-4xl font-bold text-purple-600 mb-8">TƯ VẤN VÀ ĐIỀU TRỊ:</h2>

                        <div className="space-y-4">
                            <ServiceItem
                                icon={<CircleIcon />}
                                text="Tư vấn, trị liệu tình dục"
                            />
                        </div>

                        <ServiceItem
                            icon={<CircleIcon />}
                            text="Theo dõi điều trị bệnh lây truyền qua đường tình dục (STIs)"
                        />

                        <ServiceItem
                            icon={<CircleIcon />}
                            text="Quản lý kế hoạch hóa gia đình, tránh thai"
                        />

                        <ServiceItem
                            icon={<CircleIcon />}
                            text="Hỗ trợ quản lý bệnh nhân"
                        />


                    </div> */}




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

                </div>

                {/* Main Menu Navigation Buttons
                <div className="w-full bg-indigo-500 text-white py-2">
                    <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between">
                        <Link to="/about" className="px-6 py-3 font-semibold text-lg hover:bg-indigo-600 transition-colors">ABOUT US</Link>
                        <button className="px-6 py-3 font-semibold text-lg hover:bg-indigo-600 transition-colors">SERVICE PRICE LIST</button>
                        <button className="px-6 py-3 font-semibold text-lg hover:bg-indigo-600 transition-colors">MEDICAL TEST RESULTS</button>
                        <button className="px-6 py-3 font-semibold text-lg hover:bg-indigo-600 transition-colors">MEDIA SECTION</button>
                    </div>
                </div> */}


                {/* News and Events Section */}
                {/* <div className="bg-gray-50 py-16"> */}
                {/* <div className="container mx-auto px-4"> */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> */}
                {/* History Item 1 */}
                {/* <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-purple-500 mb-4">
                                    12/2022: Establishment of GHSMS HCM
                                </h3>
                                <p className="text-gray-700">
                                    was established with the purpose of examining, diagnosing, and providing treatment advice on
                                    issues related to male and female sexuality; homosexuality – bisexuality and transgender,
                                    intersex cases as well as cases of gender differentiation disorders.
                                </p>
                            </div> */}

                {/* History Item 2 */}
                {/* <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-purple-500 mb-4">
                                    25/06/2023: Scientific Workshop: Update on Male and Female Sexual Health Care
                                </h3>
                                <p className="text-gray-700">
                                    Vietnam Society of Gender Medicine (VSSM) and HCM city Andrology and Infertility Hospital
                                    organized a scientific seminar  "UPDATING MALE AND FEMALE SEXUAL HEALTH CARE".
                                </p>
                            </div> */}

                {/* </div>
                    </div>
                </div> */}
                <div className='text-center relative bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50'>
                    <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Chăm sóc sức khỏe toàn diện</span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                        Đội ngũ chuyên gia hàng đầu với hơn 15 năm kinh nghiệm,
                        mang đến dịch vụ y tế chất lượng cao và tư vấn chuyên nghiệp
                    </p>
                </div>
                <Service />


                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-pink-600 mb-2">
                                Theo dõi chu kì kinh nguyệt
                            </h1>
                            <p className="text-gray-600">
                                Quản lý và dự đoán chu kì kinh nguyệt của bạn một cách chính xác
                            </p>
                        </div>

                        {!showTracker && (
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                                <h2 className="text-2xl font-semibold text-pink-600 mb-6 text-center">
                                    Trả lời ba câu hỏi đơn giản và nhận bộ theo dõi chu kì tùy chỉnh!
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="text-center">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ngày của chu kì cuối cùng?
                                        </label>
                                        <input
                                            type="date"
                                            value={lastPeriodDate}
                                            onChange={(e) => setLastPeriodDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-center"
                                        />
                                    </div>

                                    <div className='text-center'>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kéo dài bao lâu?
                                        </label>
                                        <div className="flex items-center justify-center space-x-3">
                                            <button
                                                onClick={() => setPeriodDuration(Math.max(1, periodDuration - 1))}
                                                className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-semibold px-4 py-2 bg-gray-50 rounded-lg">
                                                {periodDuration} Ngày
                                            </span>
                                            <button
                                                onClick={() => setPeriodDuration(periodDuration + 1)}
                                                className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200"
                                            >
                                                +
                                            </button>
                                        </div>

                                    </div>

                                    <div className='text-center'>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Độ dài chu kì thông thường của bạn?
                                        </label>
                                        <div className="flex items-center justify-center space-x-3">
                                            <button
                                                onClick={() => setCycleLength(Math.max(21, cycleLength - 1))}
                                                className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-semibold px-4 py-2 bg-gray-50 rounded-lg">
                                                {cycleLength} Ngày
                                            </span>
                                            <button
                                                onClick={() => setCycleLength(cycleLength + 1)}
                                                className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200"
                                            >
                                                +
                                            </button>
                                        </div>

                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={handleTrackNow}
                                        disabled={!lastPeriodDate}
                                        className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Theo dõi ngay
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Tracker Display */}
                        {showTracker && (
                            <>
                                {/* Navigation */}
                                <div className="flex justify-between items-center mb-6">
                                    <button
                                        onClick={() => setCurrentMonth(currentMonth - 1)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
                                    >
                                        <ChevronLeft size={20} />
                                        <span>3 tháng trước</span>
                                    </button>

                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Bộ theo dõi của bạn
                                    </h2>

                                    <button
                                        onClick={() => setCurrentMonth(currentMonth + 1)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
                                    >
                                        <span>3 tháng tới</span>
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                    {renderCalendar(-1)}
                                    {renderCalendar(0)}
                                    {renderCalendar(1)}
                                </div>

                                {/* Legend */}
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                                            <span className="text-sm">Giai đoạn tiền kinh</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                                            <span className="text-sm">Ngày có kinh</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                                            <span className="text-sm">Giai đoạn sau rụng trứng</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                            <span className="text-sm">Giai đoạn rụng trứng cao điểm</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Reset Button */}
                                <div className="text-center mt-6">
                                    <button
                                        onClick={() => {
                                            setShowTracker(false);
                                            setLastPeriodDate('');
                                            setPredictions({});
                                        }}
                                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        Cập nhật thông tin
                                    </button>
                                </div>

                                {/* Disclaimer */}
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6 rounded">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Lưu ý:</strong> Bộ theo dõi chu kì này chỉ mang tính chất ước tính.
                                        Chu kì kinh nguyệt duy nhất của bạn có thể khác với những kết quả này.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>



            </div>

            <Footer />
        </div>
    )
}
