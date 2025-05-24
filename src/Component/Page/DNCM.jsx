import React from 'react';
import {Link} from 'react-router-dom';
import Navigation from '../Nav/Navigation'; 
import Footer from '../Footer/Footer';
import LogoGHSMS from '../Logo/LogoGHSMS';
import DoctorTeam from '../Array/DoctorTeam';
import {doctors} from '../Array/DoctorTeam';

export default function DNCM() { 
  const specialistTeam = doctors.map((doctor) => ({
    id: doctor.id,
    name: doctor.name,
    title: doctor.title,
    description: doctor.description,
    image: doctor.image,
    specialty: "Y học Giới tính & Nam học", 
    education: "Đại học Y Dược TP.HCM", 
    experience: "10+ năm kinh nghiệm",
  }));

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
        </div>
        <Navigation />
      </header>

      {/* Introduction Banner with Return Home */}
      <div className="w-full bg-indigo-500 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-3">
            <h1 className="text-4xl font-bold mt-2">Đội Ngũ Chuyên Môn</h1>
            <Link 
              to="/" 
              className="inline-flex items-center bg-white text-indigo-700 px-6 py-2 rounded-full font-medium hover:bg-indigo-50 transition-colors mb-1"
            >
              Trang Chủ
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="bg-gradient-to-r from-purple-100 to-blue-50 py-16">
          <div className="container mx-auto px-4">
            
            {/* Team introduction */}
            <div className="max-w-6xl mx-auto">
              {/* First row - 3 cards */}
              <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
                {specialistTeam.slice(0, 3).map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden flex-1 max-w-sm transition-transform duration-300 hover:transform hover:scale-105"
                  >
                    <div className="h-64">
                      <img 
                        src={doctor.image || `https://placehold.co/300x400/667eea/ffffff?text=${doctor.name}`}
                        alt={doctor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-purple-600">{doctor.name}</h3>
                      <p className="text-indigo-500 font-semibold mb-3">{doctor.title}</p>
                      <p className="text-gray-700 mb-4">{doctor.description}</p>
                      {doctor.specialty && (
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Chuyên môn:</span> {doctor.specialty}</p>
                      )}
                      {doctor.education && (
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Học vấn:</span> {doctor.education}</p>
                      )}
                      {doctor.experience && (
                        <p className="text-gray-700"><span className="font-semibold">Kinh nghiệm:</span> {doctor.experience}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Second row - 2 cards */}
              <div className="flex flex-col md:flex-row justify-center gap-6">
                {specialistTeam.slice(3, 5).map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden flex-1 max-w-sm transition-transform duration-300 hover:transform hover:scale-105"
                  >
                    <div className="h-64">
                      <img 
                        src={doctor.image || `https://placehold.co/300x400/667eea/ffffff?text=${doctor.name}`}
                        alt={doctor.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-purple-600">{doctor.name}</h3>
                      <p className="text-indigo-500 font-semibold mb-3">{doctor.title}</p>
                      <p className="text-gray-700 mb-4">{doctor.description}</p>
                      {doctor.specialty && (
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Chuyên môn:</span> {doctor.specialty}</p>
                      )}
                      {doctor.education && (
                        <p className="text-gray-700 mb-2"><span className="font-semibold">Học vấn:</span> {doctor.education}</p>
                      )}
                      {doctor.experience && (
                        <p className="text-gray-700"><span className="font-semibold">Kinh nghiệm:</span> {doctor.experience}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Certifications and Training */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-12">Chứng Chỉ và Đào Tạo</h2>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm mb-12">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Chứng Chỉ Quốc Tế</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Hội viên Hiệp hội Y học Giới tính Thế giới (WAS)</li>
                <li>Chứng nhận chuyên môn từ Hiệp hội Y học Giới tính Châu Á - Thái Bình Dương (AFSM)</li>
                <li>Chứng chỉ đào tạo về Tư vấn và Trị liệu Tình dục từ Trường Đại học Y Harvard</li>
                <li>Chứng nhận chuyên môn về Y học LGBT+ từ Hiệp hội Y khoa Hoa Kỳ</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Đào Tạo Liên Tục</h3>
              <p className="text-gray-700 mb-4">
                Đội ngũ chuyên môn của Trung tâm Y học Giới tính TPHCM thường xuyên tham gia các khóa đào tạo, 
                hội thảo khoa học và cập nhật kiến thức mới nhất trong lĩnh vực Y học Giới tính. Điều này đảm bảo 
                rằng chúng tôi luôn áp dụng những phương pháp điều trị tiên tiến nhất và phù hợp nhất cho từng bệnh nhân.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Tham gia hội nghị quốc tế về Y học Giới tính hàng năm</li>
                <li>Cập nhật kiến thức và kỹ năng mới thông qua các khóa học trực tuyến từ các tổ chức y tế hàng đầu</li>
                <li>Tổ chức các buổi hội thảo và đào tạo nội bộ hàng tháng</li>
                <li>Hợp tác nghiên cứu với các trường đại học và viện nghiên cứu trong và ngoài nước</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}