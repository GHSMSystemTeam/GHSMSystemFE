import { Link } from "lucide-react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";


export default function NewsComponent2() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
            {/* Header */}
                <Header />    
            {/* Introduction Banner with Return Home */}
            <div
            className="w-full text-white relative bg-cover bg-center min-h-[300px]"
            style={{
                backgroundImage: "url('https://api.genetica.asia/storage/2086430-1651674708RMU05.jpg?width=1220')"
            }}
            >
                <div className="absolute inset-0 bg-indigo-800 bg-opacity-40"></div>
                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                        <h1
                        className="text-4xl font-bold text-white  text-center"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                        >
                        Tư vấn sức khỏe sinh sản cho nam giới
                        </h1>
                </div>
            </div>
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
            {/* Article Content */}
                <div className="container mx-auto px-4 py-12 flex-1">
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-12">
                        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                            Tầm quan trọng của sức khỏe sinh sản nam giới 
                        </h2>
                        <div className="rounded-lg w-full mb-6 bg-gray-200 flex items-center justify-center h-56 transition-all duration-500 hover:scale-105">
                            <img
                                src="https://afhanoi.com/wp-content/uploads/2022/09/.jpg"
                                alt="Sức khỏe nam giới"
                                className="rounded-lg w-full mb-6"
                            />
                        </div>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                                Sức khỏe sinh sản không chỉ là vấn đề của phụ nữ mà còn là trách nhiệm và quyền lợi của nam giới. Việc chăm sóc sức khỏe sinh sản giúp nam giới duy trì khả năng sinh sản, phòng ngừa các bệnh lây truyền qua đường tình dục và nâng cao chất lượng cuộc sống gia đình.
                            </p>
                            <h3 className="text-xl font-medium text-indigo-600 mb-2">1. Khám sức khỏe sinh sản định kỳ</h3>
                            <p className="mb-4 text-gray-700">
                                Nam giới nên chủ động khám sức khỏe sinh sản định kỳ để phát hiện sớm các vấn đề như rối loạn nội tiết, viêm nhiễm hoặc các bệnh lý về tinh hoàn, tuyến tiền liệt. Việc này giúp phòng ngừa vô sinh và các biến chứng nguy hiểm khác.
                            </p>
                            <h3 className="text-xl font-medium text-indigo-600 mb-2">2. Phòng ngừa các bệnh lây truyền qua đường tình dục (STIs)</h3>
                            <p className="mb-4 text-gray-700">
                                Sử dụng bao cao su khi quan hệ tình dục, giữ vệ sinh cá nhân và tiêm phòng các bệnh như viêm gan B, HPV là những biện pháp hiệu quả giúp nam giới phòng tránh các bệnh lây truyền qua đường tình dục.
                            </p>
                            <h3 className="text-xl font-medium text-indigo-600 mb-2">3. Duy trì lối sống lành mạnh</h3>
                            <p className="mb-4 text-gray-700">
                                Chế độ ăn uống cân đối, tập thể dục thường xuyên, hạn chế rượu bia và không hút thuốc lá giúp tăng cường sức khỏe sinh sản và nâng cao chất lượng tinh trùng.
                            </p>
                            <h3 className="text-xl font-medium text-indigo-600 mb-2">4. Hỗ trợ tâm lý và chia sẻ với bạn đời</h3>
                            <p className="mb-4 text-gray-700">
                                Sức khỏe tinh thần cũng ảnh hưởng lớn đến sức khỏe sinh sản. Nam giới nên chia sẻ, tâm sự với bạn đời hoặc chuyên gia khi gặp khó khăn về tâm lý, tránh căng thẳng kéo dài.
                            </p>
                            <h3 className="text-xl font-medium text-indigo-600 mb-2">5. Lời khuyên từ chuyên gia</h3>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                                <li>Khám sức khỏe sinh sản định kỳ ít nhất 1 lần/năm.</li>
                                <li>Quan hệ tình dục an toàn, chung thủy một vợ một chồng.</li>
                                <li>Giữ vệ sinh cá nhân sạch sẽ, đặc biệt là vùng kín.</li>
                                <li>Ăn uống đủ chất, bổ sung kẽm, vitamin và khoáng chất.</li>
                                <li>Tập thể dục đều đặn, duy trì cân nặng hợp lý.</li>
                                <li>Chủ động đi khám khi có dấu hiệu bất thường như đau, sưng, tiết dịch lạ ở bộ phận sinh dục.</li>
                            </ul>
                            <p className="text-gray-700">
                                Sức khỏe sinh sản nam giới là yếu tố quan trọng góp phần xây dựng hạnh phúc gia đình và xã hội. Hãy chủ động bảo vệ sức khỏe của mình ngay từ hôm nay!
                            </p>
                    </div>

                    <div className="max-w-5xl mx-auto rounded-lg shadow-md p-12 bg-gray-100 rounded mt-8 p-4">
                        <div className="flex items-center text-gray-600 mb-2 md:mb-0">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Cập nhật lần cuối: 10/05/2023
                        </div>
                    </div>                    
                </div>                
            </main> 
            <Footer/>       
        </div>
    );
}