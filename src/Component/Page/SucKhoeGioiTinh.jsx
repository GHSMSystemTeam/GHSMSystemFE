import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function SucKhoeGioiTinh() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
            {/* Header */}
            <Header />
            <div className="w-full bg-indigo-500 text-white py-24 bg-cover bg-center relative"
                style={{
                backgroundImage: "url('https://www.verywellhealth.com/thmb/D6iFpvkwAgRmo6l-3m-kohXfaz8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chairs-arranged-in-medical-building-961288374-5c0ac61146e0fb0001e2e5a8.jpg')"
                }}>
                        <div className="absolute inset-0 bg-black opacity-50"></div>    
                    <div className="container mx-auto px-4  relative z-10">
                        <div className="text-center text-white">
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="text-4xl font-bold mb-4">Sức khỏe giới tính</h1>
                        </div>
                    </div>
                </div>
            </div>  
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">  
                <div className="bg-white rounded-lg shadow-sm p-4"> 
                    <div className="container mx-auto px-4">            
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">1. Sức khỏe giới tính là gì?</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            -Sức khỏe giới tính là một phần quan trọng trong cuộc sống của mỗi người, ảnh hưởng đến cả thể chất, tinh thần và chất lượng cuộc sống. Việc hiểu biết đúng về sức khỏe giới tính giúp bạn chủ động bảo vệ bản thân, xây dựng các mối quan hệ lành mạnh và phòng tránh các nguy cơ về sức khỏe.
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                            -Sức khỏe giới tính không chỉ là sự vắng mặt của bệnh tật mà còn là trạng thái khỏe mạnh về thể chất, tinh thần và xã hội liên quan đến tình dục và giới tính. Điều này bao gồm sự hiểu biết về cơ thể, nhận thức về giới, quyền và trách nhiệm trong các mối quan hệ tình dục.
                        </p>
                        <div className="w-full mb-6 bg-gray-200 flex items-center justify-center rounded-lg transition-all duration-500 hover:scale-105">
                            <img
                                src="https://placehold.co/800x250/667eea/ffffff?text=Sức khỏe giới tính"
                                alt="Sức khỏe giới tính"
                                className="rounded-lg shadow-md w-full object-cover "
                            />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">2. Tại sao cần quan tâm đến sức khỏe giới tính?</h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Phòng tránh các bệnh lây truyền qua đường tình dục (STIs).</li>
                            <li>Chủ động trong việc kế hoạch hóa gia đình và tránh thai an toàn.</li>
                            <li>Hiểu và tôn trọng bản thân, xây dựng mối quan hệ lành mạnh.</li>
                            <li>Phát hiện sớm và điều trị các vấn đề về sức khỏe sinh sản.</li>
                            <li>Giảm nguy cơ mang thai ngoài ý muốn và các hệ lụy xã hội.</li>
                        </ul>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">3. Một số lưu ý để bảo vệ sức khỏe giới tính</h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Luôn sử dụng biện pháp bảo vệ khi quan hệ tình dục.</li>
                            <li>Khám sức khỏe định kỳ, đặc biệt là kiểm tra các bệnh lây truyền qua đường tình dục.</li>
                            <li>Trao đổi cởi mở với bạn tình về các vấn đề liên quan đến sức khỏe giới tính.</li>
                            <li>Không ngần ngại tìm kiếm sự tư vấn từ chuyên gia y tế khi có thắc mắc hoặc dấu hiệu bất thường.</li>
                            <li>Giáo dục giới tính cho bản thân và người thân trong gia đình.</li>
                        </ul>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">4. Khi nào nên đi khám sức khỏe giới tính?</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            -Bạn nên đi khám sức khỏe giới tính định kỳ hoặc khi có các dấu hiệu bất thường như: đau, ngứa, tiết dịch bất thường ở cơ quan sinh dục, có vết loét, nổi mụn, hoặc sau khi có quan hệ tình dục không an toàn.
                        </p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">5. Kết luận</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            -Chăm sóc sức khỏe giới tính là trách nhiệm của mỗi người đối với bản thân và cộng đồng. Hãy chủ động tìm hiểu, thực hành các biện pháp an toàn và đừng ngần ngại tìm kiếm sự hỗ trợ từ các chuyên gia y tế khi cần thiết.
                        </p>
                    </div> 
                </div>    
            </main>  
            <Footer />
        </div>
    );
}