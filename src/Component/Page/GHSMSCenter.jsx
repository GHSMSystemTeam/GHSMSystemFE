import React from 'react';
import { Phone, Mail, ChevronDown, Search, Calendar, MessageCircle } from 'lucide-react';
import NavItem from '../Nav/NavItem';
import LogoGHSMS from '../Logo/LogoGHSMS';
import ServiceItem from '../Service/ServiceItem';
import CircleIcon from '../Icon/CircleIcon';
import { Link } from 'react-router-dom';
import Navigation from '../Nav/Navigation';
import DoctorTeam from '../Team/DoctorTeam';
import Footer from '../Footer/Footer';




export default function GHSMSCenter() {
   
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
                <Navigation/>
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

                {/* Main Menu Navigation Buttons */}
                <div className="w-full bg-indigo-500 text-white py-2">
                    <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between">
                        <Link to="/about" className="px-6 py-3 font-semibold text-lg hover:bg-indigo-600 transition-colors">ABOUT US</Link>
                        <button className="px-6 py-3 font-semibold text-lg hover:bg-indigo-600 transition-colors">SERVICE PRICE LIST</button>
                        <button className="px-6 py-3 font-semibold text-lg hover:bg-indigo-600 transition-colors">MEDICAL TEST RESULTS</button>
                        <button className="px-6 py-3 font-semibold text-lg hover:bg-indigo-600 transition-colors">MEDIA SECTION</button>
                    </div>
                </div>


                {/* News and Events Section */}
                <div className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* History Item 1 */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-purple-500 mb-4">
                                    12/2022: Establishment of GHSMS HCM
                                </h3>
                                <p className="text-gray-700">
                                    was established with the purpose of examining, diagnosing, and providing treatment advice on
                                    issues related to male and female sexuality; homosexuality – bisexuality and transgender,
                                    intersex cases as well as cases of gender differentiation disorders.
                                </p>
                            </div>

                            {/* History Item 2 */}
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold text-purple-500 mb-4">
                                    25/06/2023: Scientific Workshop: Update on Male and Female Sexual Health Care
                                </h3>
                                <p className="text-gray-700">
                                    Vietnam Society of Gender Medicine (VSSM) and HCM city Andrology and Infertility Hospital
                                    organized a scientific seminar  "UPDATING MALE AND FEMALE SEXUAL HEALTH CARE".
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
                <DoctorTeam/>

            </div>

            <Footer/>
        </div>
    )
}
