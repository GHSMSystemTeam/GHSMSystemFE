import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Nav/Navigation';
import Footer from '../Footer/Footer';
import LogoGHSMS from '../Logo/LogoGHSMS';
import { Mail, Phone } from 'lucide-react';
import Header from '../Header/Header';

export default function NewsPage() {
  // Mock data for development (in Vietnamese, focused on gender healthcare)
  const mockNews = [
    {
      id: 1,
      title: 'Chăm sóc sức khỏe toàn diện cho phụ nữ mọi lứa tuổi',
      shortDescription: 'Phòng khám của chúng tôi cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho phụ nữ ở mọi giai đoạn cuộc sống, từ thanh thiếu niên đến tuổi trung niên và cao tuổi.',
      image: 'https://via.placeholder.com/300x200',
      date: '15/05/2023',
      slug: 'cham-soc-suc-khoe-phu-nu'
    },
    {
      id: 2,
      title: 'Tư vấn sức khỏe sinh sản cho nam giới',
      shortDescription: 'Dịch vụ tư vấn sức khỏe sinh sản dành cho nam giới giúp nâng cao nhận thức và đảm bảo sức khỏe tối ưu.',
      image: 'https://via.placeholder.com/300x200',
      date: '10/05/2023',
      slug: 'tu-van-suc-khoe-nam-gioi'
    },
    {
      id: 3,
      title: 'Tầm quan trọng của khám sức khỏe định kỳ cho phụ nữ',
      shortDescription: 'Khám sức khỏe định kỳ đóng vai trò quan trọng trong việc phát hiện sớm và phòng ngừa các vấn đề sức khỏe phụ nữ.',
      image: 'https://via.placeholder.com/300x200',
      date: '05/05/2023',
      slug: 'kham-suc-khoe-dinh-ky-phu-nu'
    },
    {
      id: 4,
      title: 'Sức khỏe tâm lý và giới tính - Mối liên hệ quan trọng',
      shortDescription: 'Nghiên cứu mới cho thấy mối liên hệ mật thiết giữa sức khỏe tâm lý và các vấn đề về giới tính, cách tiếp cận toàn diện.',
      image: 'https://via.placeholder.com/300x200',
      date: '28/04/2023',
      slug: 'suc-khoe-tam-ly-gioi-tinh'
    },
    {
      id: 5,
      title: 'Dinh dưỡng và sức khỏe sinh sản',
      shortDescription: 'Chế độ dinh dưỡng đóng vai trò quan trọng trong việc duy trì sức khỏe sinh sản cho cả nam và nữ.',
      image: 'https://via.placeholder.com/300x200',
      date: '20/04/2023',
      slug: 'dinh-duong-suc-khoe-sinh-san'
    },
    {
      id: 6,
      title: 'Các phương pháp tránh thai hiện đại và an toàn',
      shortDescription: 'Tổng quan về các phương pháp tránh thai hiện đại, ưu nhược điểm và cách lựa chọn phù hợp với từng cá nhân.',
      image: 'https://via.placeholder.com/300x200',
      date: '15/04/2023',
      slug: 'phuong-phap-tranh-thai'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Introduction Banner with Return Home */}
      <div className="w-full bg-indigo-500 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <div>
              <h2 className="text-4xl font-bold mb-4">Tin Tức Báo Chí</h2>
              <p className="text-indigo-100">Cập nhật thông tin mới nhất từ Trung tâm Y học Giới tính TPHCM</p>
            </div>
            <div className="flex items-center justify-center text-sm">
              <Link
                to="/"
                className="mt-4 md:mt-0 inline-flex items-center bg-white text-indigo-700 px-6 py-2 rounded-full font-medium hover:bg-indigo-50 transition-colors transition-all duration-500 hover:scale-105"
              >
                Trang Chủ
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="bg-gradient-to-r from-purple-100 to-blue-50 py-16">
          <div className="container mx-auto px-4">

            {/* News Grid */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {mockNews.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
                  >
                    <div className="h-48">
                      <img
                        src={article.image || `https://placehold.co/600x400/667eea/ffffff?text=Tin+Tức`}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {article.date}
                      </div>
                      <h3 className="text-xl font-bold text-purple-600 mb-3">{article.title}</h3>
                      <p className="text-gray-700 mb-4">{article.shortDescription}</p>
                      <Link
                        to={`/tin-tuc/${article.slug}`}
                        className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                      >
                        Đọc thêm
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}