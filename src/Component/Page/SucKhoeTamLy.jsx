import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function SucKhoeTamLy() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
            <Header />
            <div
                className="w-full bg-indigo-500 text-white py-24 bg-cover bg-center relative"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')",
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center text-white">
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="text-4xl font-bold mb-4">Sức khỏe tâm lý</h1>
                        </div>
                    </div>
                </div>
            </div>
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            1. Sức khỏe tâm lý là gì?
                        </h2>
                        <p className="text-lg text-gray-700 mb-4">
                            -Sức khỏe tâm lý là trạng thái cân bằng về cảm xúc, tinh thần và xã hội, giúp mỗi người nhận thức được khả năng của bản thân, đối mặt với căng thẳng, làm việc hiệu quả và đóng góp tích cực cho cộng đồng.
                        </p>
                        <p className="text-lg text-gray-700 mb-4">
                            -Chăm sóc sức khỏe tâm lý giúp phòng ngừa các rối loạn tâm thần, nâng cao chất lượng cuộc sống và xây dựng các mối quan hệ lành mạnh.
                        </p>
                        <div className="w-full mb-6 bg-gray-200 flex items-center justify-center rounded-lg transition-all duration-500 hover:scale-105">
                            <img
                                src="https://placehold.co/800x250/667eea/ffffff?text=Sức+khỏe+tâm+lý"
                                alt="Sức khỏe tâm lý"
                                className="rounded-lg shadow-md w-full object-cover"
                            />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            2. Tại sao cần quan tâm đến sức khỏe tâm lý?
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Giúp kiểm soát cảm xúc, giảm căng thẳng và lo âu.</li>
                            <li>Phòng ngừa các rối loạn tâm thần như trầm cảm, rối loạn lo âu, stress.</li>
                            <li>Nâng cao chất lượng cuộc sống và hiệu quả học tập, làm việc.</li>
                            <li>Xây dựng các mối quan hệ xã hội tích cực, lành mạnh.</li>
                            <li>Giúp phát triển bản thân và thích nghi tốt với thay đổi.</li>
                        </ul>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            3. Dấu hiệu cần lưu ý về sức khỏe tâm lý
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Thường xuyên cảm thấy buồn bã, lo lắng, mất ngủ hoặc mệt mỏi kéo dài.</li>
                            <li>Khó kiểm soát cảm xúc, dễ cáu gắt hoặc tuyệt vọng.</li>
                            <li>Giảm hứng thú với các hoạt động thường ngày.</li>
                            <li>Xa lánh bạn bè, gia đình hoặc có ý nghĩ tiêu cực về bản thân.</li>
                            <li>Khó tập trung, giảm hiệu quả học tập/làm việc.</li>
                        </ul>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            4. Làm gì để chăm sóc sức khỏe tâm lý?
                        </h2>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Chia sẻ cảm xúc với người thân, bạn bè hoặc chuyên gia tâm lý.</li>
                            <li>Duy trì lối sống lành mạnh: ăn uống đủ chất, ngủ đủ giấc, tập thể dục đều đặn.</li>
                            <li>Tham gia các hoạt động giải trí, thư giãn, thiền hoặc yoga.</li>
                            <li>Học cách quản lý stress và cân bằng giữa học tập, công việc và nghỉ ngơi.</li>
                            <li>Chủ động tìm kiếm sự hỗ trợ khi cảm thấy quá tải hoặc có dấu hiệu bất thường.</li>
                        </ul>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            5. Kết luận
                        </h2>
                        <p className="text-lg text-gray-700 mb-4">
                            -Sức khỏe tâm lý là nền tảng quan trọng cho sự phát triển toàn diện của mỗi người. Hãy chủ động chăm sóc và bảo vệ sức khỏe tâm lý để có cuộc sống hạnh phúc, ý nghĩa.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}