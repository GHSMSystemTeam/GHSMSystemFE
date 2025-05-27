import React from 'react';
import LogoGHSMS from '../Logo/LogoGHSMS';
import Navigation from '../Nav/Navigation';
import Footer from '../Footer/Footer';
import { Link } from 'react-router';
import { Mail, Phone } from 'lucide-react';

export default function ReproductiveManage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow-sm">
                                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Link to="/" className="mr-4">
                                            <LogoGHSMS />
                                        </Link>
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
                                            <span className="text-sm">0866.249.268</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">VN</button>
                                            <button className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">EN</button>
                                        </div>
                                    </div>
                                </div>
                                <Navigation />
            </header>
            {/* Introduction Banner with Return Home */}
            <div className="w-full bg-indigo-500 text-white py-4">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <h1 className="text-4xl font-bold mt-2">Quản lý khám và tư vấn sức khỏe sinh sản</h1>
                        <Link 
                        to="/" 
                        className="inline-flex items-center bg-white text-indigo-700 px-6 py-2 rounded-full font-medium hover:bg-indigo-50 transition-colors mb-1 transition-all duration-500 hover:scale-105"
                        >
                        Trang Chủ
                        </Link>
                    </div>
                </div>
            </div>
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight flex items-center justify-center">
                            Tư vấn sức khỏe sinh sản là gì?
                        </h1>
                        <p className="text-lg text-gray-700 mb-4">
                            Tư vấn sức khỏe sinh sản là quá trình cung cấp thông tin, hướng dẫn và hỗ trợ cá nhân về các vấn đề liên quan đến sức khỏe sinh sản và tình dục, bao gồm cả tâm lý, thể chất và yếu tố xã hội. Đây là hình thức truyền đạt kiến thức giúp người dân, đặc biệt là vị thành niên, thanh niên và phụ nữ trong độ tuổi sinh sản hiểu rõ về cách chăm sóc sức khỏe, phát hiện sớm những bất thường và có hướng điều trị kịp thời nếu cần.
                            Dịch vụ tư vấn có thể thực hiện trực tiếp tại bệnh viện, trung tâm tư vấn hoặc thông qua tổng đài tư vấn sức khỏe sinh sản miễn phí.
                        </p>
                        <div className="rounded-lg w-full mb-6 bg-gray-200 flex items-center justify-center h-56">
                            <img
                                src="https://afhanoi.com/wp-content/uploads/2022/09/quan-ly-thai-ky.jpg"
                                alt="Quản lý thai kỳ"
                                className="rounded-lg w-full mb-6"
                            />
                        </div>
                        <p className="text-lg text-gray-700 mb-4">
                            Dịch vụ quản lý khám và tư vấn sức khỏe sinh sản tại Trung tâm Y học Giới tính TPHCM mang đến sự chăm sóc toàn diện cho phụ nữ trong suốt quá trình mang thai và sinh nở. Đội ngũ chuyên gia giàu kinh nghiệm sẽ đồng hành cùng bạn từ khi chuẩn bị mang thai, trong thai kỳ cho đến sau sinh.
                        </p>
                        <h2 className="text-xl font-semibold text-purple-700 mb-2">Các dịch vụ bao gồm:</h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Tư vấn trước khi mang thai, chuẩn bị sức khỏe sinh sản</li>
                            <li>Khám thai định kỳ và theo dõi sự phát triển của thai nhi</li>
                            <li>Siêu âm, xét nghiệm sàng lọc trước sinh</li>
                            <li>Phát hiện và xử lý sớm các bất thường trong thai kỳ</li>
                            <li>Hướng dẫn chế độ dinh dưỡng, vận động phù hợp cho mẹ bầu</li>
                            <li>Tư vấn và hỗ trợ tâm lý trong suốt thai kỳ</li>
                            <li>Chăm sóc sau sinh và tư vấn nuôi con bằng sữa mẹ</li>
                        </ul>
                        <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded mb-4 ">
                            <strong>Lưu ý:</strong> Việc quản lý thai kỳ khoa học giúp mẹ và bé khỏe mạnh, phát hiện sớm các nguy cơ và xử lý kịp thời.
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}