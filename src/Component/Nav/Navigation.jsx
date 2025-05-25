import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import NavItem from './NavItem'
import { Search, ChevronDown, Bell, X } from 'lucide-react'

export default function Navigation() {
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    
    // Tạo state riêng cho từng dropdown
    const [showAboutDropdown, setShowAboutDropdown] = useState(false);
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);
    
    // Tạo notification
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    // Tạo ref riêng cho từng dropdown
    const aboutDropdownRef = useRef(null);
    const serviceDropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);
    
    // Tạo timeout riêng cho từng dropdown
    const aboutTimeoutRef = useRef(null);
    const serviceTimeoutRef = useRef(null);
    const toastTimeoutRef = useRef(null);
    
    const location = useLocation();
    const currentPath = location.pathname;
    
    // Xác định tab nào đang active dựa trên đường dẫn hiện tại
    const isActive = (path) => {
        if (path === '/' && currentPath === '/') {
            return true;
        }
        // Nếu là trang con của một section
        if (path !== '/' && currentPath.startsWith(path)) {
            return true;
        }
        return false;
    };

    // Handler cho dropdown "Giới thiệu"
    const handleAboutMouseEnter = () => {
        if (aboutTimeoutRef.current) {
            clearTimeout(aboutTimeoutRef.current);
        }
        setShowAboutDropdown(true);
    };

    const handleAboutMouseLeave = () => {
        aboutTimeoutRef.current = setTimeout(() => {
            setShowAboutDropdown(false);
        }, 50);
    };

    // Handler cho dropdown "Dịch vụ"
    const handleServiceMouseEnter = () => {
        if (serviceTimeoutRef.current) {
            clearTimeout(serviceTimeoutRef.current);
        }
        setShowServiceDropdown(true);
    };

    const handleServiceMouseLeave = () => {
        serviceTimeoutRef.current = setTimeout(() => {
            setShowServiceDropdown(false);
        }, 50);
    };

    //Handler for notification dropdown 
    const toggleNotifications = () =>{
        setShowNotifications(!showNotifications);
        if(unreadCount > 0 && !showNotifications)
        {
            setUnreadCount(0); //Danh dau da doc khi mo
        }
    };

    // Add a notification
    const addNotification = (message, type = 'success') => {
        const newNotification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date(),
            read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Show toast notification
        showToast(message, type);
    };
        // Show toast notification in the middle of the screen
    const showToast = (message, type = 'success') => {
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
    
    // Close toast manually
    const closeToast = () => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast(prev => ({ ...prev, show: false }));
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            if (aboutTimeoutRef.current) {
                clearTimeout(aboutTimeoutRef.current);
            }
            if (serviceTimeoutRef.current) {
                clearTimeout(serviceTimeoutRef.current);
            }
        };
    }, []);

    const handleAppointmentSubmit = (e) => {
        e.preventDefault();
        // Get form data
        const formData = new FormData(e.target);
        const appointmentData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            date: formData.get('date'),
            service: formData.get('service'),
            notes: formData.get('notes')
        };

        // Here you would typically send this data to your backend API
        console.log('Appointment data:', appointmentData);

        // Close the modal and show a success message
        setShowAppointmentModal(false);
        addNotification('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
    };

    // Format the timestamp for notifications
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <>
        <nav className="bg-white">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="hidden md:flex space-x-6">
                    <Link to="/">
                        <NavItem label="Trang chủ" active={currentPath === '/'} />
                    </Link>

                    {/* Dropdown "Giới thiệu" */}
                    <div className="relative"
                        ref={aboutDropdownRef}
                        onMouseEnter={handleAboutMouseEnter}
                        onMouseLeave={handleAboutMouseLeave}>

                        <div className="flex items-center cursor-pointer">
                            <NavItem
                                label="Giới thiệu"
                                icon={<ChevronDown size={16} />}
                                active={isActive('/about') || isActive('/dncm')}
                               
                            />
                        </div>
                        
                        {showAboutDropdown && (
                            <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-lg mt-1 z-50">
                                <Link to="/about"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Về CSM HCM
                                </Link>
                                <Link to="/dncm"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Đội ngũ chuyên môn
                                </Link>
                                <Link to="/news" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Tin tức báo chí
                                </Link>
                                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Tin chuyên môn
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Dropdown "Dịch vụ" */}
                    <div className='relative'
                        ref={serviceDropdownRef}
                        onMouseEnter={handleServiceMouseEnter}
                        onMouseLeave={handleServiceMouseLeave}>
                        
                        <div className='flex items-center cursor-pointer'>
                            <NavItem
                                label="Dịch vụ"
                                icon={<ChevronDown size={16} />}
                            />
                        </div>

                        {showServiceDropdown && (
                            <div className="absolute top-full left-0 w-56 bg-white shadow-lg rounded-lg mt-1 z-50">
                                <Link to="#"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Theo dõi điều trị bệnh lây truyền qua đường tình dục (STIs)
                                </Link>
                                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Quản lý kế hoạch hóa gia đình, tránh thai
                                </a>
                            </div>
                        )}
                    </div>

                    <NavItem label="Kiến thức" icon={<ChevronDown size={16} />} />
                    <NavItem label="Liên hệ" />
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    <Search size={20} className="text-gray-500" />
                     {/* Notification Bell */}
                    <div className="relative" ref={notificationDropdownRef}>
                        <button 
                            className="text-gray-500 hover:text-gray-700 focus:outline-none" 
                            onClick={toggleNotifications}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                <div className="p-3 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
                                </div>
                                <div>
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            Không có thông báo
                                        </div>
                                    ) : (
                                        notifications.map(notification => (
                                            <div 
                                                key={notification.id} 
                                                className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="flex items-start">
                                                    <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                                    <div className="ml-3 flex-1">
                                                        <p className="text-sm text-gray-800">{notification.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{formatTimestamp(notification.timestamp)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <div className="p-2 text-center border-t border-gray-100">
                                        <button 
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                            onClick={() => setNotifications([])}
                                        >
                                            Xóa tất cả
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded font-medium"
                        onClick={() => setShowAppointmentModal(true)}
                    >
                        Đặt lịch khám
                    </button>
                    
                    {/* Appointment Modal */}
                    {showAppointmentModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">Đặt lịch khám</h3>
                                        <button
                                            onClick={() => setShowAppointmentModal(false)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <form className="space-y-4" onSubmit={handleAppointmentSubmit} >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nhập họ và tên"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nhập số điện thoại"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nhập email"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám mong muốn</label>
                                            <input
                                                type="date"
                                                name="date"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ</label>
                                            <select
                                                name="service"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Chọn dịch vụ</option>
                                                <option value="tu-van">Tư vấn, trị liệu tình dục</option>
                                                <option value="tam-ly">Tham vấn và trị liệu tâm lý</option>
                                                <option value="phau-thuat">Phẫu thuật tạo hình thẩm mỹ vùng kín</option>
                                                <option value="lgbt">Chăm sóc sức khỏe cộng đồng LGBT+</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                            <textarea
                                                name="notes"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows="3"
                                                placeholder="Nhập nội dung ghi chú (nếu có)"
                                            ></textarea>
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowAppointmentModal(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Đặt lịch
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <button className="md:hidden text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </nav>

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
                                <p className={`text-sm font-medium ${
                                    toast.type === 'success' ? 'text-green-800' : 
                                    toast.type === 'error' ? 'text-red-800' : 
                                    'text-blue-800'
                                }`}>
                                    {toast.message}
                                </p>
                            </div>
                            <button 
                                className={`ml-4 flex-shrink-0 ${
                                    toast.type === 'success' ? 'text-green-500 hover:text-green-700' : 
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
        </>     
    )
}