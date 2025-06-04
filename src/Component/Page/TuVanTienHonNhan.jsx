import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function TuVanTienHonNhan() {
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
                            <h1 className="text-4xl font-bold mb-4">Tư vấn tiền hôn nhân</h1>
                        </div>
                    </div>
                </div>
            </div>
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            1. Tư vấn tiền hôn nhân là gì?
                        </h2>
                        <p className="text-lg text-gray-700 mb-4">
                            -Tư vấn tiền hôn nhân là quá trình cung cấp thông tin, kiến thức và hỗ trợ tâm lý cho các cặp đôi chuẩn bị kết hôn. Mục tiêu là giúp các bạn trẻ hiểu rõ hơn về sức khỏe, tâm lý, tài chính, pháp lý và các vấn đề liên quan đến cuộc sống hôn nhân, từ đó xây dựng nền tảng vững chắc cho một gia đình hạnh phúc.
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                            -Dịch vụ này thường bao gồm tư vấn về sức khỏe sinh sản, phòng tránh các bệnh lây truyền qua đường tình dục, kỹ năng giao tiếp, quản lý tài chính, và chuẩn bị tâm lý cho cuộc sống vợ chồng.
                        </p>
                        <div className="w-full mb-6 bg-gray-200 flex items-center justify-center rounded-lg transition-all duration-500 hover:scale-105">
                            <img
                                src="https://placehold.co/800x250/ffb6c1/ffffff?text=Tư+vấn+tiền+hôn+nhân"
                                alt="Tư vấn tiền hôn nhân"
                                className="rounded-lg shadow-md w-full object-cover"
                            />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            2. Tại sao nên tư vấn tiền hôn nhân?
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Trang bị kiến thức về sức khỏe sinh sản và phòng tránh bệnh tật.</li>
                            <li>Phát hiện và điều trị sớm các bệnh lý di truyền, bệnh lây truyền qua đường tình dục.</li>
                            <li>Chuẩn bị tâm lý, kỹ năng giao tiếp và giải quyết xung đột trong hôn nhân.</li>
                            <li>Hiểu rõ về quyền và nghĩa vụ pháp lý khi kết hôn.</li>
                            <li>Giúp các cặp đôi xây dựng kế hoạch tài chính và định hướng tương lai.</li>
                        </ul>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            3. Nội dung tư vấn tiền hôn nhân
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Tư vấn sức khỏe tổng quát, sức khỏe sinh sản cho cả nam và nữ.</li>
                            <li>Xét nghiệm các bệnh lây truyền qua đường tình dục, bệnh di truyền.</li>
                            <li>Giáo dục giới tính, kế hoạch hóa gia đình, phòng tránh mang thai ngoài ý muốn.</li>
                            <li>Hướng dẫn kỹ năng giao tiếp, chia sẻ và giải quyết mâu thuẫn.</li>
                            <li>Tư vấn về pháp luật hôn nhân và gia đình.</li>
                        </ul>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            4. Khi nào nên tư vấn tiền hôn nhân?
                        </h2>
                        <p className="text-lg text-gray-700 mb-4">
                            -Các cặp đôi nên tham gia tư vấn tiền hôn nhân trước khi đăng ký kết hôn hoặc trước khi quyết định sống chung. Việc chuẩn bị kỹ lưỡng sẽ giúp các bạn tự tin hơn khi bước vào cuộc sống gia đình.
                        </p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            5. Kết luận
                        </h2>
                        <p className="text-lg text-gray-700 mb-4">
                            -Tư vấn tiền hôn nhân là bước chuẩn bị quan trọng giúp các cặp đôi xây dựng nền tảng vững chắc cho hôn nhân hạnh phúc và bền lâu. Đừng ngần ngại tìm kiếm sự hỗ trợ từ các chuyên gia để có một khởi đầu tốt đẹp cho cuộc sống mới.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}