import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Nav/Navigation';
import Footer from '../Footer/Footer';
import LogoGHSMS from '../Logo/LogoGHSMS';
import DoctorTeam from '../Array/DoctorTeam';
import { Mail, Phone } from 'lucide-react';
import Header from '../Header/Header';
import useConsultants from '../Hooks/useConsultants';

export default function DNCM() {
  const { consultants, loading } = useConsultants();

  // Map dữ liệu cho UI
const specialistTeam = consultants.map((doctor) => ({
  id: doctor.id,
  name: doctor.name,
  // Ưu tiên lấy title, nếu không có thì lấy role.name, nếu không có thì để rỗng
  title: doctor.title || doctor.role?.name || "",
  description: doctor.description || "",
  image: doctor.profilePicture || `https://placehold.co/300x400/667eea/ffffff?text=${doctor.name}`,
  // Nếu API có specialty, education, experience thì lấy, không thì fallback mặc định
  specialty: doctor.specialization || "Y học Giới tính & Nam học",
  experience: doctor.expYear ? `${doctor.expYear}+ năm kinh nghiệm` : "10+ năm kinh nghiệm",
}));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
      <Header />

      {/* Hero Banner */}
      <div className="w-full bg-indigo-500 text-white py-24 bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://www.verywellhealth.com/thmb/D6iFpvkwAgRmo6l-3m-kohXfaz8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chairs-arranged-in-medical-building-961288374-5c0ac61146e0fb0001e2e5a8.jpg')"
        }}>
                <div className="absolute inset-0 bg-black opacity-50"></div>    
              <div className="container mx-auto px-4  relative z-10">
                <div className="text-center text-white">
                  <div className="flex flex-col items-center justify-center">
                      <h1 className="text-4xl font-bold mb-4">Đội Ngũ Chuyên Môn</h1>
                  </div>
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