import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  ArrowRight,
  Beaker,
  FlaskConical,
  Shield,
  BookOpen,
  Star,
  Check,
  X,
  Info,
  BadgeCheck,
  Bookmark,
  MessageSquare,
} from 'lucide-react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useNavigate, Link } from 'react-router-dom';
import BookingRating from '../Rating/Rating';
import { useAuthCheck } from '../Auth/UseAuthCheck';
import { useToast } from '../Toast/ToastProvider';
import { useAuth } from '../Auth/AuthContext';
import api from '../config/axios';

const TestBookingPage = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { checkAuthAndShowPrompt } = useAuthCheck();

  const [selectedKit, setSelectedKit] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingRatings, setBookingRatings] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // State cho service types từ backend
  const [testKits, setTestKits] = useState([]);
  const [loadingKits, setLoadingKits] = useState(true);

  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        address: userInfo.address || ''
      });
    }

    // Lấy danh sách booking từ backend
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/activebookings');
        setBookings(res.data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };
    fetchBookings();

    // Lấy danh sách service types từ backend
    const fetchTestKits = async () => {
      setLoadingKits(true);
      try {
        const res = await api.get('/api/servicetypes/active');

        setTestKits(res.data || []);
      } catch (err) {
        showToast('Không thể tải danh sách gói xét nghiệm!', 'error');
        console.error('Error fetching service types:', err);
      } finally {
        setLoadingKits(false);
      }
    };
    fetchTestKits();

    // Lấy bác sĩ mặc định (chạy ngầm)
    // Gọi API lấy danh sách bác sĩ khi vào trang
    const fetchDefaultDoctor = async () => {
      try {
        const res = await api.get('/api/activeconsultants'); // Đổi endpoint nếu backend bạn khác
        if (res.data && res.data.length > 0) {
          setSelectedDoctor(res.data[0]); // Lấy bác sĩ đầu tiên làm mặc định
        }
      } catch (err) {
        setSelectedDoctor(null);
      }
    };
    fetchDefaultDoctor();

  }, []);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

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

  const handleSubmitRating = (bookingId, ratingData) => {
    setBookingRatings(prev => ({
      ...prev,
      [bookingId]: ratingData
    }));
    showToast('Cảm ơn bạn đã đánh giá dịch vụ!', 'success');
  };

  const handleBooking = async () => {
    if (!checkAuthAndShowPrompt('booking')) {
      showToast('Vui lòng đăng nhập để sử dụng dịch vụ này', 'info');
      return;
    }

    if (!selectedKit || !appointmentDate || !userInfo.name || !userInfo.phone) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
      return;
    }

    // Kiểm tra selectedDoctor đã có chưa
    if (!selectedDoctor || !selectedDoctor.id) {
      showToast('Đang tải thông tin bác sĩ, vui lòng đợi hoặc thử lại sau.', 'error');
      return;
    }

    // Disable nút submit để tránh click nhiều lần
    const submitButton = document.querySelector('button[onClick="handleBooking"]');
    if (submitButton) {
      submitButton.disabled = true;
    }

    const bookingPayload = {
      consultantId: String(selectedDoctor.id),
      customerId: user.id,
      serviceTypeId: selectedKit.id,
      appointmentDate: new Date(appointmentDate).toISOString(),
      duration: 0
    };

    try {
      // Gọi API đặt lịch xét nghiệm
      const response = await api.post('/api/servicebooking', bookingPayload);
      console.log('Booking response:', response.data);

      showToast('Đặt lịch thành công!', 'success');
      setShowConfirmation(true);

      // XÓA PHẦN NÀY để tránh reload ngay lập tức
      // const res = await api.get('/api/activebookings');
      // setBookings(res.data || []);

      // Reset form
      setTimeout(() => {
        setSelectedKit(null);
        setAppointmentDate('');
        setCurrentStep(1);
        setShowConfirmation(false);
      }, 3000);
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Có lỗi xảy ra khi đặt lịch!';
      showToast(errorMessage, 'error');
    } finally {
      // Re-enable nút submit
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  };

  const handleNextStep = () => {
    if (!checkAuthAndShowPrompt('tiếp tục')) return;
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);

    if (newStatus === 'cancelled') {
      showToast('Đã hủy lịch hẹn thành công', 'info');
    } else if (newStatus === 'confirmed') {
      showToast('Đã xác nhận lịch hẹn thành công', 'success');
    }
  };

  // Lọc service types theo tab
  const getAllKits = () => {
    return testKits || [];
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-50 to-indigo-50 pt-24 mt-10">
      <Header />

      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 mb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Dịch Vụ Xét Nghiệm Sức Khỏe</h1>
            <p className="text-xl text-blue-100 mb-8">
              Khám phá các gói xét nghiệm toàn diện, được thiết kế riêng để đảm bảo sức khỏe sinh sản và tình dục của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Calendar className="mr-2" size={20} />
                Đặt lịch xét nghiệm
              </button>
              <a
                href="#info-section"
                className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <Info className="mr-2" size={20} />
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8" id="booking-section">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-center space-x-4 sm:space-x-8">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold shadow-md
                      ${currentStep >= step
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-400'}`}
                  >
                    {step === 1 ? <Package size={22} /> : <Calendar size={22} />}
                  </div>
                  {step < 2 && (
                    <div className={`hidden sm:block w-24 h-1 mx-3 
                      ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-3 space-x-8 sm:space-x-24 text-sm">
              <span className={`font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                Chọn gói
              </span>
              <span className={`font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                Đặt lịch
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Booking Form */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-5 px-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Package className="mr-3" size={24} />
                      Chọn Gói Xét Nghiệm
                    </h2>
                    <p className="text-blue-100 mt-1">
                      Lựa chọn gói xét nghiệm phù hợp với nhu cầu của bạn
                    </p>
                  </div>



                  <div className="p-6">
                    {loadingKits ? (
                      <div className="text-center text-blue-600 py-10">Đang tải danh sách gói xét nghiệm...</div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {getAllKits().length === 0 && (
                          <div className="col-span-2 text-center text-gray-500 py-10">
                            Không có gói xét nghiệm nào khả dụng.
                          </div>
                        )}
                        {getAllKits().map((kit, idx) => (
                          <div
                            key={`${kit.id || kit.name}-${idx}`}
                            className={`border-2 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg relative cursor-pointer
                ${selectedKit?.id === kit.id
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300'
                              }`}
                            onClick={() => setSelectedKit(kit)}
                          >
                            {/* Badge */}
                            {kit.active && (
                              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs py-1 px-2 rounded-full font-medium z-10 flex items-center">
                                Đang mở
                              </div>
                            )}

                            {/* Image placeholder */}
                            <div className="relative">
                              <div className="w-full h-48 bg-blue-100 flex items-center justify-center text-6xl text-blue-300">
                                <Beaker size={48} />
                              </div>
                              <div className={`absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end transition-opacity duration-300
                  ${selectedKit?.id === kit.id ? 'opacity-100' : 'opacity-0'}`}>
                                <button
                                  className="m-4 bg-white text-blue-700 px-3 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedKit(kit);
                                    handleNextStep();
                                  }}
                                >
                                  Đặt ngay <ArrowRight size={16} className="ml-1" />
                                </button>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-semibold text-lg text-gray-800 mb-2">{kit.name}</h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{kit.description}</p>
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600 flex items-center">
                                    <Package size={16} className="mr-1" />
                                    Giá:
                                  </span>
                                  <span className="font-semibold text-blue-600">
                                    {kit.price ? `${kit.price.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {selectedKit?.id === kit.id && (
                              <div className="absolute top-2 left-2 bg-blue-600 text-white rounded-full p-1">
                                <Check size={16} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleNextStep}
                        disabled={!selectedKit}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        Tiếp tục
                        <ArrowRight className="ml-2" size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-5 px-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Calendar className="mr-3" size={24} />
                      Đặt Lịch Xét Nghiệm
                    </h2>
                    <p className="text-blue-100 mt-1">
                      Chọn thời gian phù hợp và điền thông tin cá nhân của bạn
                    </p>
                  </div>

                  <div className="p-6">
                    {/* Selected Kit Summary */}
                    {selectedKit && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Beaker className="text-blue-600" size={24} />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-800 mb-1">Gói đã chọn:</h3>
                            <p className="text-blue-700 font-medium">{selectedKit.name}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-blue-600 text-sm mr-3">
                                {selectedKit.price ? `${selectedKit.price.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-8">
                      {/* Date Selection */}
                      <div className="bg-white rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <Calendar className="mr-2 text-blue-600" size={20} />
                          Chọn Ngày Xét Nghiệm
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chọn ngày <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              value={appointmentDate}
                              onChange={(e) => setAppointmentDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* User Information */}
                      <div className="bg-white rounded-lg pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <User className="mr-2 text-blue-600" size={20} />
                          Thông Tin Cá Nhân
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={userInfo.name}
                              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                              placeholder="Nhập họ và tên"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={userInfo.phone}
                              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                              placeholder="Nhập số điện thoại"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                              type="email"
                              value={userInfo.email}
                              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                              placeholder="Nhập email"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                            <input
                              type="text"
                              value={userInfo.address}
                              onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Nhập địa chỉ"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Terms agreement */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="terms"
                              type="checkbox"
                              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                              defaultChecked={true}
                            />
                          </div>
                          <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-600">
                            Tôi đồng ý với các <a href="#" className="text-blue-600 hover:underline">điều khoản dịch vụ</a> và
                            <a href="#" className="text-blue-600 hover:underline"> chính sách bảo mật</a>. Tôi hiểu rằng các thông
                            tin cá nhân của tôi sẽ được bảo mật và chỉ sử dụng cho mục đích đặt lịch xét nghiệm.
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                      >
                        Quay lại
                      </button>
                      <button
                        onClick={handleBooking}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                      >
                        <CheckCircle className="mr-2" size={20} />
                        Xác nhận đặt lịch
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Information Section */}
              <div className="mt-10 space-y-6" id="info-section">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-5 px-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <BookOpen className="mr-3" size={24} />
                      Thông tin quan trọng về xét nghiệm
                    </h2>
                    <p className="text-indigo-100 mt-1">
                      Những điều cần biết trước khi đến xét nghiệm
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Chuẩn bị trước khi xét nghiệm:</h3>
                        <ul className="space-y-2 text-gray-600">
                          <li className="flex items-start">
                            <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>Nhịn ăn 8-12 giờ trước khi lấy máu (đối với các xét nghiệm yêu cầu nhịn đói)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>Mang theo CMND/CCCD, thẻ bảo hiểm y tế (nếu có)</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>Mang theo các kết quả xét nghiệm trước đó (nếu có) để bác sĩ so sánh</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span>Đến trước giờ hẹn 15 phút để hoàn thành thủ tục đăng ký</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quy trình xét nghiệm:</h3>
                        <ol className="space-y-3">
                          <li className="flex">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-medium text-sm mr-3 flex-shrink-0">1</div>
                            <div>
                              <p className="font-medium text-gray-800">Đăng ký và xác nhận thông tin</p>
                              <p className="text-gray-600 text-sm">Nhân viên sẽ kiểm tra thông tin cá nhân và loại xét nghiệm bạn đăng ký</p>
                            </div>
                          </li>
                          <li className="flex">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-medium text-sm mr-3 flex-shrink-0">2</div>
                            <div>
                              <p className="font-medium text-gray-800">Tư vấn trước xét nghiệm</p>
                              <p className="text-gray-600 text-sm">Bác sĩ sẽ tư vấn và giải thích về các xét nghiệm bạn sẽ thực hiện</p>
                            </div>
                          </li>
                          <li className="flex">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-medium text-sm mr-3 flex-shrink-0">3</div>
                            <div>
                              <p className="font-medium text-gray-800">Lấy mẫu xét nghiệm</p>
                              <p className="text-gray-600 text-sm">Quy trình lấy mẫu diễn ra nhanh chóng, an toàn và đảm bảo vệ sinh</p>
                            </div>
                          </li>
                          <li className="flex">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center font-medium text-sm mr-3 flex-shrink-0">4</div>
                            <div>
                              <p className="font-medium text-gray-800">Nhận kết quả</p>
                              <p className="text-gray-600 text-sm">Thời gian nhận kết quả từ 1-3 ngày tùy loại xét nghiệm, có thể nhận qua email hoặc trực tiếp</p>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <Link to="/consultation" className="text-blue-600 hover:text-blue-800 flex items-center">
                        <MessageSquare size={18} className="mr-1" />
                        <span>Có thắc mắc? Đặt câu hỏi cho bác sĩ</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Info & Quick Actions */}
            <div className="space-y-6">
              {/* Quick Nav */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-4">
                  <h3 className="font-semibold text-white flex items-center">
                    <BookOpen className="mr-2" size={18} />
                    Điều hướng nhanh
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center
                        ${currentStep === 1 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                      <Package className="mr-3" size={18} />
                      <span>1. Chọn gói xét nghiệm</span>
                    </button>
                    <button
                      onClick={() => selectedKit && setCurrentStep(2)}
                      disabled={!selectedKit}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed
                        ${currentStep === 2 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                    >
                      <Calendar className="mr-3" size={18} />
                      <span>2. Đặt lịch hẹn</span>
                    </button>
                    <Link
                      to="/appointments"
                      className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 block flex items-center"
                    >
                      <CheckCircle className="mr-3" size={18} />
                      <span>Quản lý lịch hẹn</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 py-3 px-4">
                  <h3 className="font-semibold text-white flex items-center">
                    <Phone className="mr-2" size={18} />
                    Thông tin liên hệ
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-3">
                      <MapPin size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Địa chỉ:</p>
                        <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone size={18} className="text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Hotline:</p>
                        <p className="text-gray-600">0866.249.268</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail size={18} className="text-green-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email:</p>
                        <p className="text-gray-600">ttyhgt@afTPHCM.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock size={18} className="text-purple-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Giờ làm việc:</p>
                        <p className="text-gray-600">8:00 - 17:00 (T2-T7)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                  <AlertCircle className="mr-2" size={18} />
                  Lưu ý quan trọng
                </h3>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li className="flex items-start">
                    <div className="min-w-[6px] h-1.5 mt-2 rounded-full bg-amber-500 mr-2"></div>
                    <span>Vui lòng đến sớm 15 phút trước giờ hẹn</span>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[6px] h-1.5 mt-2 rounded-full bg-amber-500 mr-2"></div>
                    <span>Mang theo CMND/CCCD và sổ khám bệnh</span>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[6px] h-1.5 mt-2 rounded-full bg-amber-500 mr-2"></div>
                    <span>Nhịn ăn 8-12 tiếng trước khi xét nghiệm máu</span>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[6px] h-1.5 mt-2 rounded-full bg-amber-500 mr-2"></div>
                    <span>Liên hệ trước nếu cần thay đổi lịch hẹn</span>
                  </li>
                  <li className="flex items-start">
                    <div className="min-w-[6px] h-1.5 mt-2 rounded-full bg-amber-500 mr-2"></div>
                    <span>Kết quả sẽ có trong 1-3 ngày làm việc</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đặt lịch thành công!</h3>
              <p className="text-gray-500">
                Bạn đã đặt lịch xét nghiệm {selectedKit?.name} vào ngày{' '}
                {new Date(appointmentDate).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-gray-500 mt-1">
                Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn.
              </p>
              <div className="mt-4">
                <Link
                  to="/appointments"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Calendar className="mr-2" size={16} />
                  Xem lịch hẹn của tôi
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TestBookingPage;