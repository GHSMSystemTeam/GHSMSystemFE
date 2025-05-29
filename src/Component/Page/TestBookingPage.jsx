import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Package, User, Phone, Mail, MapPin, AlertCircle } from 'lucide-react';
import Navigation from '../Nav/Navigation';
import LogoGHSMS from '../Logo/LogoGHSMS';
import Header from '../Header/Header';

const TestBookingPage = () => {
  const [selectedKit, setSelectedKit] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: ''
  });
  const toastTimeoutRef = useRef(null);
  const showLocalToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };
   const closeToast = () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(prev => ({ ...prev, show: false }));
  };
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);
  const [bookings, setBookings] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const testKits = [
    {
      id: 1,
      name: 'Gói Xét Nghiệm Tổng Quát Nam Giới',
      price: '1,500,000 VNĐ',
      duration: '2-3 giờ',
      tests: ['Hormone nam giới', 'Chức năng sinh sản', 'STD/STI', 'Tầm soát ung thư'],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      description: 'Gói xét nghiệm toàn diện cho sức khỏe nam giới'
    },
    {
      id: 2,
      name: 'Gói Xét Nghiệm Hormone Giới Tính',
      price: '2,200,000 VNĐ',
      duration: '1-2 giờ',
      tests: ['Testosterone', 'Estrogen', 'FSH/LH', 'Prolactin'],
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=200&fit=crop',
      description: 'Đánh giá toàn diện hệ thống nội tiết tố giới tính'
    },
    {
      id: 3,
      name: 'Gói Xét Nghiệm STD/STI Cơ Bản',
      price: '800,000 VNĐ',
      duration: '30-45 phút',
      tests: ['HIV', 'Syphilis', 'Hepatitis B/C', 'Chlamydia'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop',
      description: 'Tầm soát các bệnh lây truyền qua đường tình dục'
    },
    {
      id: 4,
      name: 'Gói Xét Nghiệm Chức Năng Sinh Sản',
      price: '1,800,000 VNĐ',
      duration: '2-3 giờ',
      tests: ['Tinh dịch đồ', 'DNA mảnh tinh trùng', 'Hormone sinh sản', 'Siêu âm'],
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=200&fit=crop',
      description: 'Đánh giá khả năng sinh sản và chức năng sinh dục'
    }
  ];

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

  const handleBooking = () => {
    if (!selectedKit || !appointmentDate || !appointmentTime || !userInfo.name || !userInfo.phone) {
      showLocalToast('Vui lòng điền đầy đủ thông tin bắt buộc!','error');
      return;
    }

    const newBooking = {
      id: Date.now(),
      kit: selectedKit,
      date: appointmentDate,
      time: appointmentTime,
      userInfo: { ...userInfo },
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setBookings([...bookings, newBooking]);

    // Reset form
    setSelectedKit(null);
    setAppointmentDate('');
    setAppointmentTime('');
    setUserInfo({ name: '', phone: '', email: '', address: '' });
    setCurrentStep(1);

    //Show toast
    showLocalToast(  'Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.', 'success');
    // Add to bell notification
    if (window.addNotificationToNav) {
    window.addNotificationToNav(`Bạn đã đặt lịch hẹn với gói ${newBooking.kit.name} vào ngày ${new Date(newBooking.date).toLocaleDateString('vi-VN')} lúc ${newBooking.time}.`,
    'success');
    }
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">

      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2 space-x-12 text-sm">
              <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Chọn gói</span>
              <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Đặt lịch</span>
              <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>Theo dõi</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Booking Form */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Package className="mr-3 text-blue-600" />
                    Chọn Gói Xét Nghiệm
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {testKits.map((kit) => (
                      <div
                        key={kit.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedKit?.id === kit.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300'
                          }`}
                        onClick={() => setSelectedKit(kit)}
                      >
                        <img
                          src={kit.image}
                          alt={kit.name}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">{kit.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{kit.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Giá:</span>
                            <span className="font-semibold text-blue-600">{kit.price}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Thời gian:</span>
                            <span className="text-gray-800">{kit.duration}</span>
                          </div>
                        </div>
                        <div className="border-t pt-3">
                          <p className="text-xs text-gray-600 mb-2">Bao gồm:</p>
                          <div className="flex flex-wrap gap-1">
                            {kit.tests.map((test, index) => (
                              <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded">
                                {test}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => selectedKit && setCurrentStep(2)}
                      disabled={!selectedKit}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Tiếp tục
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <Calendar className="mr-3 text-blue-600" />
                    Đặt Lịch Hẹn
                  </h2>

                  {/* Selected Kit Summary */}
                  {selectedKit && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue-800 mb-2">Gói đã chọn:</h3>
                      <p className="text-blue-700">{selectedKit.name}</p>
                      <p className="text-blue-600 text-sm">{selectedKit.price} - {selectedKit.duration}</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn ngày <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn giờ <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setAppointmentTime(time)}
                            className={`p-3 text-sm border rounded-lg transition-colors ${appointmentTime === time
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-blue-300'
                              }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* User Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập họ và tên"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập email"
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
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleBooking}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Đặt lịch
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <CheckCircle className="mr-3 text-green-600" />
                    Theo dõi lịch hẹn
                  </h2>

                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Đặt lịch mới
                    </button>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Chưa có lịch hẹn nào</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">{booking.kit.name}</h3>
                              <p className="text-gray-600">{booking.userInfo.name} - {booking.userInfo.phone}</p>
                            </div>
                            <div className="flex items-center space-x-3 mt-2 md:mt-0">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar size={16} className="text-gray-500" />
                              <span>{new Date(booking.date).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock size={16} className="text-gray-500" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Package size={16} className="text-gray-500" />
                              <span>{booking.kit.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User size={16} className="text-gray-500" />
                              <span>{booking.kit.duration}</span>
                            </div>
                          </div>

                          {booking.status === 'pending' && (
                            <div className="mt-4 flex space-x-2">
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                              >
                                Xác nhận
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                              >
                                Hủy lịch
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Panel - Info & Quick Actions */}
            <div className="space-y-6">
              {/* Quick Nav */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Điều hướng nhanh</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${currentStep === 1 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                  >
                    1. Chọn gói xét nghiệm
                  </button>
                  <button
                    onClick={() => selectedKit && setCurrentStep(2)}
                    disabled={!selectedKit}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentStep === 2 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                  >
                    2. Đặt lịch hẹn
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${currentStep === 3 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                      }`}
                  >
                    3. Theo dõi lịch hẹn
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Thông tin liên hệ</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <MapPin size={16} className="text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Địa chỉ:</p>
                      <p className="text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-blue-500" />
                    <div>
                      <p className="font-medium">Hotline:</p>
                      <p className="text-gray-600">0866.249.268</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-green-500" />
                    <div>
                      <p className="font-medium">Email:</p>
                      <p className="text-gray-600">ttyhgt@afTPHCM.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-purple-500" />
                    <div>
                      <p className="font-medium">Giờ làm việc:</p>
                      <p className="text-gray-600">8:00 - 17:00 (T2-T7)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                  <AlertCircle size={18} className="mr-2" />
                  Lưu ý quan trọng
                </h3>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li>• Vui lòng đến sớm 15 phút trước giờ hẹn</li>
                  <li>• Mang theo CMND/CCCD và sổ khám bệnh</li>
                  <li>• Nhịn ăn 8-12 tiếng trước khi xét nghiệm máu</li>
                  <li>• Liên hệ trước nếu cần thay đổi lịch hẹn</li>
                  <li>• Kết quả sẽ có trong 1-3 ngày làm việc</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
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
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TestBookingPage ;