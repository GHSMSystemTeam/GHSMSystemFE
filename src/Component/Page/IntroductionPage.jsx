import React from 'react';
import { Phone, Mail, ChevronDown, Search, Calendar, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavItem from '../Nav/NavItem';
import LogoGHSMS from '../Logo/LogoGHSMS';
import CircleIcon from '../Icon/CircleIcon';
import Navigation from '../Nav/Navigation';
import Footer from '../Footer/Footer';

export default function IntroductionPage() {
    return (
        <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-purple-100 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="mr-4">
                            <LogoGHSMS />
                        </Link>
                        <div className="hidden lg:block">
                            <h1 className="text-blue-700 font-semibold text-lg uppercase">Trung tâm Y học Giới tính TPHCM</h1>
                            <p className="text-gray-600 text-sm">Bệnh viện Nam học và Hiếm muộn TPHCM</p>
                            <p className="text-gray-500 text-xs">Center for Sexual Medicine of HCM city</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-1">
                            <Mail size={16} className="text-blue-600" />
                            <span className="text-sm">ttyhgt@afTPHCM.com</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                            <Phone size={16} className="text-blue-600" />
                            <span className="text-sm">0866.249.268</span>
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

            {/* Hero Banner */}
            <div className="w-full bg-indigo-500 text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="text-center text-white">
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="text-4xl font-bold mb-4">Giới thiệu</h1>
                            <Link 
                                to="/" 
                                className="inline-flex items-center bg-white text-indigo-700 px-6 py-2 rounded-full font-medium hover:bg-indigo-50 transition-colors transition-all duration-500 hover:scale-105"
                                >
                                Trang Chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Introduction Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar - about menu */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm mb-6">
                            <h3 className="text-lg font-semibold p-4 border-b border-gray-100">Giới thiệu</h3>
                            <ul>
                                <li className="border-b border-gray-100 last:border-b-0">
                                    <Link to="/about" className="block p-4 hover:bg-blue-50 text-blue-700 font-medium">
                                        Về CSM HCM
                                    </Link>
                                </li>
                                <li className="border-b border-gray-100 last:border-b-0">
                                    <Link to="/dncm" className="block p-4 hover:bg-blue-50">
                                        Đội ngũ chuyên môn
                                    </Link>
                                </li>
                                <li className="border-b border-gray-100 last:border-b-0">
                                    <Link to="/news" className="block p-4 hover:bg-blue-50">
                                        Tin tức báo chí
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact sidebar */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h3 className="text-lg font-semibold mb-4">Liên hệ với chúng tôi</h3>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Địa chỉ:</p>
                                        <p className="font-medium">Đường 22, Thành phố Thủ Đức</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <Phone size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Điện thoại:</p>
                                        <p className="font-medium">0866.249.268</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                                        <Mail size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email:</p>
                                        <p className="font-medium">ttyhgt@afTPHCM.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Giới thiệu về Trung tâm Y học Giới tính </h1>
                            
                            <div className="prose max-w-none">
                                <div className="mb-8">
                                    <img 
                                        src="/images/center-building.jpg" 
                                        alt="Trung tâm Y học Giới tính Hà Nội" 
                                        className="w-full h-auto rounded-lg mb-4"
                                        onError={(e) => e.target.src = 'https://placehold.co/800x400?text=Trung+tâm+Y+học+Giới+tính+Hà+Nội'}
                                    />
                                    <p className="text-sm text-center text-gray-500 italic">Trung tâm Y học Giới tính TPHCM - Nơi đặt niềm tin cho sức khỏe giới tính của bạn</p>
                                </div>
                                
                                <h2 className="text-2xl font-semibold text-blue-700 mb-4">Về chúng tôi</h2>
                                <p className="mb-6 text-gray-700 leading-relaxed">
                                    Trung tâm Y học Giới tính TPHCM (CSM HCM) là đơn vị chuyên khoa đầu ngành về lĩnh vực y học giới tính tại miền Bắc Việt Nam. 
                                    Chúng tôi cung cấp các dịch vụ chuyên sâu trong điều trị, tư vấn và chăm sóc sức khỏe giới tính toàn diện cho nam giới, nữ giới 
                                    và cộng đồng đa dạng giới.
                                </p>
                                
                                <p className="mb-6 text-gray-700 leading-relaxed">
                                    Trung tâm được thành lập với đội ngũ bác sĩ, chuyên gia tâm lý và nhân viên y tế có trình độ chuyên môn cao, 
                                    được đào tạo bài bản tại các cơ sở y tế trong nước và quốc tế. Chúng tôi tự hào áp dụng phác đồ điều trị tiên tiến 
                                    và các phương pháp kỹ thuật hiện đại trong chẩn đoán và điều trị.
                                </p>

                                <h2 className="text-2xl font-semibold text-blue-700 mb-4 mt-8">Tầm nhìn và Sứ mệnh</h2>
                                <div className="mb-6 bg-blue-50 p-5 rounded-lg">
                                    <h3 className="text-xl font-medium text-blue-600 mb-3">Tầm nhìn</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Trở thành trung tâm y học giới tính hàng đầu tại Việt Nam và khu vực Đông Nam Á, tiên phong trong việc 
                                        phát triển các phương pháp điều trị hiện đại và toàn diện, góp phần nâng cao chất lượng đời sống tình dục 
                                        của người dân.
                                    </p>
                                </div>
                                
                                <div className="mb-8 bg-blue-50 p-5 rounded-lg">
                                    <h3 className="text-xl font-medium text-blue-600 mb-3">Sứ mệnh</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Mang đến giải pháp toàn diện cho các vấn đề sức khỏe tình dục, đồng thời nâng cao nhận thức của cộng đồng 
                                        về tầm quan trọng của sức khỏe giới tính thông qua các hoạt động tư vấn, giáo dục và truyền thông, góp phần 
                                        xóa bỏ các rào cản và định kiến xã hội.
                                    </p>
                                </div>

                                <h2 className="text-2xl font-semibold text-blue-700 mb-4">Lĩnh vực chuyên môn</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-medium text-blue-600 mb-2">Nam học</h3>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                            <li>Điều trị rối loạn cương dương</li>
                                            <li>Điều trị xuất tinh sớm</li>
                                            <li>Điều trị vô sinh nam</li>
                                            <li>Phẫu thuật nam khoa</li>
                                        </ul>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-medium text-blue-600 mb-2">Nữ khoa</h3>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                            <li>Rối loạn ham muốn tình dục nữ</li>
                                            <li>Rối loạn cực khoái</li>
                                            <li>Đau khi quan hệ tình dục</li>
                                            <li>Điều trị các bệnh phụ khoa liên quan</li>
                                        </ul>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-medium text-blue-600 mb-2">Tâm lý giới tính</h3>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                            <li>Tư vấn tâm lý</li>
                                            <li>Trị liệu tâm lý cho các vấn đề tình dục</li>
                                            <li>Liệu pháp cặp đôi</li>
                                            <li>Tư vấn sức khỏe tình dục</li>
                                        </ul>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-medium text-blue-600 mb-2">Sức khỏe cộng đồng đa dạng giới</h3>
                                        <ul className="list-disc pl-5 text-gray-700 space-y-1">
                                            <li>Tư vấn cho cộng đồng LGBT+</li>
                                            <li>Dịch vụ y tế thân thiện</li>
                                            <li>Hỗ trợ tâm lý</li>
                                            <li>Điều trị nội tiết</li>
                                        </ul>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-semibold text-blue-700 mb-4 mt-8">Giá trị cốt lõi</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-blue-600">Chuyên môn</h3>
                                        <p className="text-gray-600 mt-2">Cam kết chất lượng chuyên môn cao với đội ngũ y bác sĩ giỏi</p>
                                    </div>
                                    <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-blue-600">Bảo mật</h3>
                                        <p className="text-gray-600 mt-2">Tôn trọng quyền riêng tư và bảo mật thông tin của người bệnh</p>
                                    </div>
                                    <div className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-blue-600">Đồng cảm</h3>
                                        <p className="text-gray-600 mt-2">Hiểu và chia sẻ với mỗi trải nghiệm của người bệnh</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
           <Footer/>



            {/* Floating contact buttons */}
            <div className="fixed right-4 bottom-4 flex flex-col space-y-2 z-50">
                <button className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                    <MessageCircle size={24} className="text-white" />
                </button>
                <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                    <Phone size={24} className="text-white" />
                </button>
            </div>
        </div>
    );
}