import { Link } from "react-router-dom";
import { Mail, Phone, MessageCircle } from "lucide-react";
import LogoGHSMS from "../Logo/LogoGHSMS";
import Navigation from "../Nav/Navigation";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";


export default function STDsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
                    {/* Header */}
                    <Header />
                    <div
                        className="w-full bg-indigo-500 text-white py-24 bg-cover bg-center relative"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1500&q=80')",
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="container mx-auto px-4 relative z-10">
                            <div className="text-center text-white">
                                <div className="flex flex-col items-center justify-center">
                                    <h1 className="text-4xl font-bold mb-4">Bệnh lây truyền</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Main Content */}
                    <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-12">
                        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch">
                            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-[52%]">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">Thông tin về STIs</h1>
                                <p className="text-lg text-gray-700 mb-4">
                                    Bệnh lây truyền qua đường tình dục (STIs) là những bệnh nhiễm trùng lây lan chủ yếu qua quan hệ tình dục.
                                    Chúng có thể do vi khuẩn, virus hoặc ký sinh
                                </p>
                                <h3 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">Các loại STIs phổ biến</h3>
                                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                                    <li>Chlamydia</li>
                                    <li>Lậu (Gonorrhea)</li>
                                    <li>Giang mai (Syphilis)</li>
                                    <li>Sùi mào gà (HPV)</li>
                                    <li>Mụn rộp sinh dục (Herpes simplex)</li>
                                    <li>Viêm gan B, C</li>
                                    <li>HIV/AIDS</li>
                                    <li>Trichomonas</li>
                                </ul> 
                                <h3 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">Triệu chứng</h3>
                                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                                    <li>Tiết dịch bất thường từ bộ phận sinh dục</li>
                                    <li>Đau khi đi tiểu hoặc quan hệ tình dục</li>
                                    <li>Ngứa hoặc rát ở vùng kín</li>
                                    <li>Phát ban hoặc mụn nước ở vùng sinh dục</li> 
                                </ul>
                                <h3 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">Biến chứng</h3>
                                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                                    <li>Vô sinh, hiếm muộn</li>
                                    <li>Viêm nhiễm cơ quan sinh dục, tiết niệu</li>
                                    <li>Ung thư cổ tử cung, ung thư dương vật</li>
                                    <li>Lây truyền từ mẹ sang con</li>
                                    <li>Ảnh hưởng tâm lý, chất lượng cuộc sống</li>
                                </ul>
                                <h3 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">Phòng ngừa</h3>
                                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                                    <li>Sử dụng bao cao su khi quan hệ tình dục</li>
                                    <li>Tránh quan hệ tình dục không an toàn</li>
                                    <li>Khám sức khỏe định kỳ, xét nghiệm STIs khi có nguy cơ</li>
                                    <li>Không dùng chung kim tiêm, vật dụng cá nhân</li>
                                    <li>Tiêm vắc xin phòng ngừa (HPV, viêm gan B...)</li>
                                </ul>
                                <h3 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">Khi nào cần khám bác sĩ</h3> 
                                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
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
                            <div className="flex flex-col items-center justify-center w-full md:w-[48%] gap-6">   
                                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-full">
                                    <div className="w-full flex flex-col items-center transition-all duration-500 hover:scale-105">                                
                                        <img
                                            src="https://placehold.co/600x400/667eea/ffffff?text=Bệnh+lây+truyền+qua+đường+tình+dục+1"
                                            alt="Bệnh lây truyền qua đường tình dục 1"
                                            className="rounded-lg shadow-md max-h-[420px] w-full object-cover "
                                            loading="lazy"
                                        />
                                        <span className="mt-2 text-base font-semibold text-blue-700 text-center">Chlamydia &amp; Lậu (Gonorrhea)</span>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-full">
                                    <div className="w-full flex flex-col items-center transition-all duration-500 hover:scale-105"> 
                                        <img
                                            src="https://placehold.co/600x400/667eea/ffffff?text=Bệnh+lây+truyền+qua+đường+tình+dục+2"
                                            alt="Bệnh lây truyền qua đường tình dục 2"
                                            className="rounded-lg shadow-md max-h-[420px] w-full object-cover"
                                            loading="lazy"
                                        />
                                        <span className="mt-2 text-base font-semibold text-blue-700 text-center">Sùi mào gà (HPV) &amp; Mụn rộp sinh dục (Herpes)</span>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center w-full">
                                    <div className="w-full flex flex-col items-center transition-all duration-500 hover:scale-105">
                                        <img
                                            src="https://placehold.co/600x400/667eea/ffffff?text=Bệnh+lây+truyền+qua+đường+tình+dục+3"
                                            alt="Bệnh lây truyền qua đường tình dục 3"
                                            className="rounded-lg shadow-md max-h-[420px] w-full object-cover"
                                            loading="lazy"
                                        />
                                        <span className="mt-2 text-base font-semibold text-blue-700 text-center">HIV/AIDS &amp; Viêm gan B, C</span>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </main>
                {/* Footer */}  
                 <Footer />                   
        </div>
    );
}