import React from 'react'
import { Link } from 'react-router-dom';
import LogoGHSMS from '../Logo/LogoGHSMS';
import Navigation from '../Nav/Navigation';
import { Mail, Phone } from 'lucide-react';

export default function Header() {
    return (
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
    )
}
