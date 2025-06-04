import React from 'react'
import { Link } from 'react-router-dom';
import LogoGHSMS from '../Logo/LogoGHSMS';
import Navigation from '../Nav/Navigation';
import { Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { User, LogOut } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

export default function Header() {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const blogCategories = [
        { name: 'Sức khỏe sinh sản', slug: 'suc-khoe-sinh-san' },
        { name: 'Sức khỏe giới tính', slug: 'suc-khoe-gioi-tinh' },
        { name: 'Tư vấn tiền hôn nhân', slug: 'tu-van-tien-hon-nhan' },
        { name: 'Kế hoạch hóa gia đình', slug: 'ke-hoach-hoa-gia-dinh' },
        { name: 'Bệnh lây truyền', slug: 'benh-lay-truyen' },
        { name: 'Sức khỏe tâm lý', slug: 'suc-khoe-tam-ly' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
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

                    {/* Auth Section */}
                    {!user ? (
                        // Hiển thị nút đăng nhập/đăng ký khi chưa đăng nhập
                        <div className="flex items-center space-x-2">
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors whitespace-nowrap"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-blue-600 text-white px-3 py-2 rounded font-medium hover:bg-blue-700 transition-colors whitespace-nowrap text-sm"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    ) : (
                        // Hiển thị thông tin user khi đã đăng nhập

                        <div className="relative">
                            <button
                                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-lg"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-medium">
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                </div>
                                <span className="text-gray-700 font-medium">{user.fullName}</span>
                            </button>

                            {/* User dropdown menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        Thông tin cá nhân
                                    </Link>
                                    <Link
                                        to="/appointments"
                                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        Lịch hẹn của tôi
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
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
            <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="relative group">
                    <Link
                        to="/blog"
                        className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                        Kiến thức
                        <ChevronDown className="ml-1 w-4 h-4" />
                    </Link>

                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                        {blogCategories.map((category) => (
                            <Link
                                key={category.slug}
                                to={`/blog?category=${category.slug}`}
                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    )
}
