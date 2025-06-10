import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function NewsComponent6() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
            <Header />
            {/* Banner */}
            <div
                className="w-full text-white relative bg-cover bg-center min-h-[300px]"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1500&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-indigo-800 bg-opacity-40"></div>
                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                    <h1
                        className="text-4xl font-bold text-white text-center"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                    >
                        Các phương pháp tránh thai hiện đại và an toàn
                    </h1>
                </div>
            </div>
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
                <div className="container mx-auto px-4 py-12 flex-1">
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            Lựa chọn phương pháp tránh thai phù hợp cho sức khỏe và hạnh phúc
                        </h2>
                        <div className="rounded-lg w-full mb-6 bg-gray-200 flex items-center justify-center h-40 transition-all duration-500 hover:scale-105 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=800&q=80"
                                alt="Các phương pháp tránh thai"
                                className="rounded-lg w-full h-full object-contain"
                            />
                        </div>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Tránh thai là một phần quan trọng trong chăm sóc sức khỏe sinh sản, giúp các cặp đôi chủ động kế hoạch hóa gia đình và bảo vệ sức khỏe. Hiện nay, có nhiều phương pháp tránh thai hiện đại, an toàn và hiệu quả, phù hợp với nhu cầu và điều kiện của từng người.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">1. Bao cao su</h3>
                        <p className="mb-4 text-gray-700">
                            Bao cao su là phương pháp tránh thai phổ biến, dễ sử dụng và có thể phòng ngừa các bệnh lây truyền qua đường tình dục (STIs). Đây là lựa chọn an toàn cho cả nam và nữ, không ảnh hưởng đến nội tiết tố.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">2. Thuốc tránh thai hàng ngày</h3>
                        <p className="mb-4 text-gray-700">
                            Thuốc tránh thai chứa hormone giúp ngăn rụng trứng, hiệu quả cao nếu sử dụng đúng cách. Tuy nhiên, cần uống đều đặn mỗi ngày và tham khảo ý kiến bác sĩ trước khi sử dụng, đặc biệt với người có bệnh lý nền.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">3. Que cấy tránh thai</h3>
                        <p className="mb-4 text-gray-700">
                            Que cấy tránh thai là một thanh nhỏ chứa hormone được cấy dưới da tay, có tác dụng ngừa thai từ 3-5 năm. Phương pháp này phù hợp với phụ nữ muốn tránh thai lâu dài mà không phải nhớ uống thuốc hàng ngày.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">4. Vòng tránh thai (IUD)</h3>
                        <p className="mb-4 text-gray-700">
                            Vòng tránh thai là dụng cụ nhỏ đặt vào tử cung, có thể ngừa thai từ 5-10 năm tùy loại. Đây là phương pháp hiệu quả, lâu dài và không ảnh hưởng đến sinh hoạt hàng ngày.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">5. Các phương pháp khác</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Miếng dán tránh thai, vòng âm đạo: chứa hormone, sử dụng theo chu kỳ hàng tháng.</li>
                            <li>Thuốc tiêm tránh thai: tiêm mỗi 3 tháng một lần.</li>
                            <li>Triệt sản nam/nữ: phương pháp vĩnh viễn, phù hợp với người không còn nhu cầu sinh con.</li>
                        </ul>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">Lưu ý khi lựa chọn phương pháp tránh thai</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Tham khảo ý kiến bác sĩ để chọn phương pháp phù hợp với sức khỏe và nhu cầu cá nhân.</li>
                            <li>Tuân thủ hướng dẫn sử dụng để đạt hiệu quả tối ưu.</li>
                            <li>Kiểm tra sức khỏe định kỳ khi sử dụng các phương pháp nội tiết hoặc dụng cụ tử cung.</li>
                            <li>Luôn sử dụng bao cao su khi muốn phòng tránh các bệnh lây truyền qua đường tình dục.</li>
                        </ul>
                        <p className="text-gray-700">
                            Việc lựa chọn phương pháp tránh thai phù hợp giúp bảo vệ sức khỏe sinh sản, chủ động kế hoạch hóa gia đình và nâng cao chất lượng cuộc sống. Hãy tìm hiểu kỹ và tham khảo ý kiến chuyên gia trước khi quyết định!
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto rounded-lg shadow-md p-12 bg-gray-100 rounded mt-8 p-4">
                        <div className="flex items-center text-gray-600 mb-2 md:mb-0">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Cập nhật lần cuối: 15/04/2023
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}