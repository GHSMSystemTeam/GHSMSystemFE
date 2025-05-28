import { Link } from "react-router-dom";
import { Mail, Phone, MessageCircle } from "lucide-react";
import LogoGHSMS from "../Logo/LogoGHSMS";
import Navigation from "../Nav/Navigation";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";


export default function STDsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50">
        {/* Header */}
                   <Header/>

                    {/* Banner */}
                    <div className="w-full bg-indigo-500 text-white py-4">
                        <div className="container mx-auto px-4">
                            <div className="text-center text-white">
                                <div className="flex flex-col items-center justify-center">
                                    <h1 className="text-4xl font-bold mb-4">Bệnh lây truyền qua đường tình dục (STIs)</h1>
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
                    {/* Main Content */}
                    <main className="container mx-auto px-4 py-8 flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h1 className="text-xl font-semibold mb-4">Thông tin về STIs</h1>
                                <p className="text-gray-700 mb-4">
                                    Bệnh lây truyền qua đường tình dục (STIs) là những bệnh nhiễm trùng lây lan chủ yếu qua quan hệ tình dục.
                                    Chúng có thể do vi khuẩn, virus hoặc ký sinh
                                </p>
                                <h3 className="text-lg font-semibold mb-2">Các loại STIs phổ biến</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    <li>Chlamydia</li>
                                    <li>Lậu (Gonorrhea)</li>
                                    <li>Giang mai (Syphilis)</li>
                                    <li>Sùi mào gà (HPV)</li>
                                    <li>Mụn rộp sinh dục (Herpes simplex)</li>
                                    <li>Viêm gan B, C</li>
                                    <li>HIV/AIDS</li>
                                    <li>Trichomonas</li>
                                </ul> 
                                <h3 className="text-lg font-semibold mt-4">Triệu chứng</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    <li>Tiết dịch bất thường từ bộ phận sinh dục</li>
                                    <li>Đau khi đi tiểu hoặc quan hệ tình dục</li>
                                    <li>Ngứa hoặc rát ở vùng kín</li>
                                    <li>Phát ban hoặc mụn nước ở vùng sinh dục</li> 
                                </ul>
                                <h3 className="text-lg font-semibold mt-4">Biến chứng</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-11">
                                    <li>Vô sinh, hiếm muộn</li>
                                    <li>Viêm nhiễm cơ quan sinh dục, tiết niệu</li>
                                    <li>Ung thư cổ tử cung, ung thư dương vật</li>
                                    <li>Lây truyền từ mẹ sang con</li>
                                    <li>Ảnh hưởng tâm lý, chất lượng cuộc sống</li>
                                </ul>
                                <h3 className="text-lg font-semibold mt-4">Phòng ngừa</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    <li>Sử dụng bao cao su khi quan hệ tình dục</li>
                                    <li>Tránh quan hệ tình dục không an toàn</li>
                                    <li>Khám sức khỏe định kỳ, xét nghiệm STIs khi có nguy cơ</li>
                                    <li>Không dùng chung kim tiêm, vật dụng cá nhân</li>
                                    <li>Tiêm vắc xin phòng ngừa (HPV, viêm gan B...)</li>
                                </ul>
                                <h3 className="text-lg font-semibold mt-4">Khi nào cần khám bác sĩ</h3> 
                                <ul className="list-disc list-inside text-gray-700">
                                    <li>Nếu có triệu chứng nghi ngờ STIs</li>
                                    <li>Đã có quan hệ tình dục không an toàn</li>
                                    <li>Bạn tình có dấu hiệu mắc bệnh</li>
                                    <li>Đã từng mắc STIs trước đó</li>
                                </ul>
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6 rounded-lg">
                                    <p className="text-blue-700">
                                       <strong>Lưu ý:</strong> STIs có thể không có triệu chứng rõ ràng. Khám và xét nghiệm định kỳ giúp phát hiện sớm và điều trị hiệu quả, bảo vệ sức khỏe bản thân và cộng đồng.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-center h-full">
                                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-8  h-full ">                                    
                                    <img
                                        src="https://placehold.co/600x400/667eea/ffffff?text=Bệnh+lây+truyền+qua+đường+tình+dục+1"
                                        alt="Bệnh lây truyền qua đường tình dục 1"
                                        className="rounded-lg shadow-md max-h-[420px] w-full object-cover transition-all duration-500 hover:scale-105 "
                                        loading="lazy"
                                    />
                                    <img
                                        src="https://placehold.co/600x400/667eea/ffffff?text=Bệnh+lây+truyền+qua+đường+tình+dục+2"
                                        alt="Bệnh lây truyền qua đường tình dục 2"
                                        className="rounded-lg shadow-md max-h-[420px] w-full object-cover transition-all duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                    <img
                                        src="https://placehold.co/600x400/667eea/ffffff?text=Bệnh+lây+truyền+qua+đường+tình+dục+3"
                                        alt="Bệnh lây truyền qua đường tình dục 3"
                                        className="rounded-lg shadow-md max-h-[420px] w-full object-cover transition-all duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            
                        </div>
                    </main>
                {/* Footer */}  
                 <Footer />                   
        </div>
    );
}