import Footer from "../Footer/Footer";
import Header from "../Header/Header";

export default function NewsComponent3() {
    return (
<div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
            <Header />
            {/* Banner */}
            <div
                className="w-full text-white relative bg-cover bg-center min-h-[300px]"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-indigo-800 bg-opacity-40"></div>
                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                    <h1
                        className="text-4xl font-bold text-white text-center"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                    >
                        Tầm quan trọng của khám sức khỏe định kỳ cho phụ nữ
                    </h1>
                </div>
            </div>
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
                <div className="container mx-auto px-4 py-12 flex-1">
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            Khám sức khỏe định kỳ – Chìa khóa bảo vệ sức khỏe phụ nữ
                        </h2>
                        <div className="rounded-lg w-full mb-6 bg-gray-200 flex items-center justify-center h-40 transition-all duration-500 hover:scale-105 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1512070679279-c5a4b67c1d53?auto=format&fit=crop&w=800&q=80"
                                alt="Khám sức khỏe phụ nữ"
                                className="rounded-lg w-full h-full object-contain"
                            />
                        </div>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Khám sức khỏe định kỳ là một trong những biện pháp quan trọng giúp phụ nữ chủ động bảo vệ sức khỏe bản thân. Việc kiểm tra sức khỏe thường xuyên không chỉ giúp phát hiện sớm các bệnh lý tiềm ẩn mà còn tạo điều kiện để phòng ngừa và điều trị kịp thời, nâng cao chất lượng cuộc sống.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">1. Phát hiện sớm các bệnh lý nguy hiểm</h3>
                        <p className="mb-4 text-gray-700">
                            Nhiều bệnh lý phụ khoa, ung thư cổ tử cung, ung thư vú hay các bệnh mãn tính như tiểu đường, tăng huyết áp thường không có triệu chứng rõ ràng ở giai đoạn đầu. Khám sức khỏe định kỳ giúp phát hiện sớm những bất thường, từ đó tăng khả năng điều trị thành công và giảm thiểu biến chứng.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">2. Theo dõi và chăm sóc sức khỏe sinh sản</h3>
                        <p className="mb-4 text-gray-700">
                            Khám phụ khoa định kỳ giúp phụ nữ kiểm soát tốt sức khỏe sinh sản, phát hiện sớm các vấn đề như viêm nhiễm, rối loạn kinh nguyệt, u xơ tử cung, u nang buồng trứng... Đặc biệt, phụ nữ trong độ tuổi sinh sản hoặc chuẩn bị mang thai càng cần chú trọng khám định kỳ để đảm bảo sức khỏe cho mẹ và bé.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">3. Tư vấn phòng ngừa và chăm sóc sức khỏe toàn diện</h3>
                        <p className="mb-4 text-gray-700">
                            Thông qua các buổi khám định kỳ, phụ nữ sẽ được tư vấn về chế độ dinh dưỡng, lối sống lành mạnh, cách phòng tránh các bệnh lây truyền qua đường tình dục và các biện pháp chăm sóc sức khỏe phù hợp với từng giai đoạn cuộc đời.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">4. Lời khuyên từ chuyên gia</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Khám sức khỏe tổng quát và phụ khoa định kỳ ít nhất 1 lần/năm.</li>
                            <li>Chủ động tầm soát ung thư vú, ung thư cổ tử cung theo khuyến cáo của bác sĩ.</li>
                            <li>Chia sẻ với bác sĩ về các dấu hiệu bất thường hoặc thay đổi trong cơ thể.</li>
                            <li>Duy trì lối sống lành mạnh, ăn uống cân đối và tập thể dục thường xuyên.</li>
                        </ul>
                        <p className="text-gray-700">
                            Đừng chờ đến khi có dấu hiệu bất thường mới đi khám. Chủ động kiểm tra sức khỏe định kỳ là cách tốt nhất để bảo vệ bản thân và những người thân yêu. Hãy yêu thương và chăm sóc chính mình ngay từ hôm nay!
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto rounded-lg shadow-md p-12 bg-gray-100 rounded mt-8 p-4">
                        <div className="flex items-center text-gray-600 mb-2 md:mb-0">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Cập nhật lần cuối: 05/05/2023
                        </div>
                    </div> 
                </div>
            </main>
            <Footer />
        </div>
    );        
}