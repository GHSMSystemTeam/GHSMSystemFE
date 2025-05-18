import React, { use } from 'react'
import { useState, useEffect, useRef } from 'react'
import { Phone, Mail, ChevronDown, Search, Calendar, MessageCircle } from 'lucide-react';
import NavItem from '../Nav/NavItem';
import LogoGHSMS from '../Logo/LogoGHSMS';
import ServiceItem from '../Service/ServiceItem';
import CircleIcon from '../Icon/CircleIcon';





export default function GHSMSCenter() {
    const [activeTab, setActiveTab] = useState('home');
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
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
    alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
};
    // const [showDropdown, setShowDropdown] = useState(false);
    // const dropdownRef = useRef(null);
    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    //             setShowDropdown(false);
    //         }
    //     }

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [])
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
                <nav className="bg-white">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <div className="hidden md:flex space-x-6">
                            <NavItem label="Trang chủ" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />

                            <div className="relative group">
                                <NavItem label="Giới thiệu"
                                    icon={<ChevronDown size={16} />}
                                    // onClick={() => setShowDropdown(!showDropdown)}
                                    // active={showDropdown} 
                                     active={activeTab === 'about'}
                                    />
                                {/* {showDropdown && ( */}
                                     <div className="hidden group-hover:block absolute top-full left-0 w-56 bg-white shadow-lg rounded-lg py-2 mt-1 z-50">
                                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                            Về CSM HANOI
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                            Đội ngũ chuyên môn
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                            Tin tức báo chí
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                            Tin chuyên môn
                                        </a>
                                    </div>
                                {/* )} */}
                            </div>
                            <NavItem label="Dịch vụ" icon={<ChevronDown size={16} />} />
                            <NavItem label="Kiến thức" icon={<ChevronDown size={16} />} />
                            <NavItem label="Liên hệ" />
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <Search size={20} className="text-gray-500" />
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
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Nhập họ và tên"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                                    <input 
                                                        type="tel" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Nhập số điện thoại"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input 
                                                        type="email" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Nhập email"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày khám mong muốn</label>
                                                    <input 
                                                        type="date" 
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ</label>
                                                    <select 
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
            </header>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-100 to-blue-50">
                <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 md:pr-12 z-10">
                        <div className="flex items-center mb-6">
                            <LogoGHSMS />
                        </div>
                        <h2 className="text-4xl font-bold text-purple-600 mb-8">TƯ VẤN VÀ ĐIỀU TRỊ:</h2>

                        <div className="space-y-4">
                            <ServiceItem
                                icon={<CircleIcon />}
                                text="Tư vấn, trị liệu tình dục"
                            />
                        </div>

                        <ServiceItem
                            icon={<CircleIcon />}
                            text="Tham vấn và trị liệu tâm lý"
                        />

                        <ServiceItem
                            icon={<CircleIcon />}
                            text="Phẫu thuật tạo hình thẩm mỹ vùng kín"
                        />

                        <ServiceItem
                            icon={<CircleIcon />}
                            text="Chăm sóc sức khỏe cộng đồng LGBT+"
                        />


                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex items-center mb-4 sm:mb-0 sm:mr-8">
                            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                                <Phone size={24} className="text-purple-600" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-purple-600">Hotline</p>
                                <p className="text-lg font-semibold text-purple-500">0866 249 268</p>
                            </div>
                        </div>

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
            </div>
        </div>
    )
}
