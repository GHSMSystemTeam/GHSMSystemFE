import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom'
import NavItem from './NavItem'
import { Search, ChevronDown, Bell, X } from 'lucide-react'

export default function Navigation() {
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
    
    // Search 
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim() !== "") {
            // Navigate to the search results page with the search query
            navigate(`/search?query=${encodeURIComponent(search)}`);
            setSearch(""); // Reset search input
        }
    };

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
            document.removeEventListener("mousedown", handleClickOutside);
            if (aboutTimeoutRef.current) {
                clearTimeout(aboutTimeoutRef.current);
            }
            if (serviceTimeoutRef.current) {
                clearTimeout(serviceTimeoutRef.current);
            }
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    // addNotification globally
    useEffect(() => {
    window.addNotificationToNav = addNotification;
    return () => {
        window.addNotificationToNav = null;
        };
    }, []);

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
                                <Link to="/reproductive-manage"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Quản lý khám và tư vấn sức khỏe sinh sản
                                </Link>
                                <Link to="/test"
                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Đặt lịch xét nghiệm trực tuyến
                                </Link>
                                <Link to="/family-plan" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Quản lý kế hoạch hóa gia đình, tránh thai
                                </Link>
                                {/* <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600
                                            transition-colors duration-200">
                                    Hỗ trợ quản lý bệnh nhân
                                </a> */}
                            </div>
                        )}
                    </div>

                    <NavItem label="Kiến thức" icon={<ChevronDown size={16} />} />
                    <NavItem label="Liên hệ" />
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-md">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="w-full border-2 border-blue-500 rounded-lg px-3 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-600"
                        />
                        <button 
                            type="submit" 
                            className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                            aria-label="Search"
                        >
                            <Search size={20} className="text-gray-500" />
                        </button>
                    </form>
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
                    <Link
                        to="/appointment"
                        className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition-colors"
                    >
                        Đặt lịch khám
                    </Link>                                        
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