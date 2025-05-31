import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function NewsComponent5() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
            <Header />
            {/* Banner */}
            <div
                className="w-full text-white relative bg-cover bg-center min-h-[300px]"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-indigo-800 bg-opacity-40"></div>
                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                    <h1
                        className="text-4xl font-bold text-white text-center"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                    >
                        Dinh dưỡng và sức khỏe sinh sản
                    </h1>
                </div>
            </div>
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
                <div className="container mx-auto px-4 py-12 flex-1">
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-12">
                        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                            Vai trò của dinh dưỡng đối với sức khỏe sinh sản
                        </h2>
                        <div className="rounded-lg w-full mb-6 bg-gray-200 flex items-center justify-center h-40 transition-all duration-500 hover:scale-105 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=800&q=80"
                                alt="Dinh dưỡng và sức khỏe sinh sản"
                                className="rounded-lg w-full h-full object-contain"
                            />
                        </div>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Dinh dưỡng hợp lý là yếu tố nền tảng giúp duy trì và nâng cao sức khỏe sinh sản cho cả nam và nữ. Một chế độ ăn cân đối không chỉ hỗ trợ chức năng sinh lý mà còn giúp phòng ngừa các bệnh lý liên quan đến sinh sản, tăng khả năng thụ thai và đảm bảo sự phát triển khỏe mạnh cho thai nhi.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">1. Dinh dưỡng ảnh hưởng đến khả năng sinh sản</h3>
                        <p className="mb-4 text-gray-700">
                            Thiếu hụt các vi chất như sắt, kẽm, axit folic, vitamin D, E có thể làm giảm chất lượng trứng và tinh trùng, gây rối loạn kinh nguyệt hoặc giảm khả năng thụ thai. Ngược lại, thừa cân, béo phì cũng làm tăng nguy cơ vô sinh và các biến chứng thai kỳ.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">2. Chế độ ăn uống lành mạnh cho sức khỏe sinh sản</h3>
                        <p className="mb-4 text-gray-700">
                            Cả nam và nữ nên duy trì chế độ ăn giàu rau xanh, trái cây, ngũ cốc nguyên hạt, protein từ cá, thịt nạc, trứng, sữa và các loại hạt. Hạn chế thực phẩm chế biến sẵn, nhiều đường, chất béo bão hòa và đồ uống có cồn để bảo vệ sức khỏe sinh sản.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">3. Dinh dưỡng cho phụ nữ mang thai và cho con bú</h3>
                        <p className="mb-4 text-gray-700">
                            Phụ nữ mang thai cần bổ sung đầy đủ axit folic, sắt, canxi, DHA để hỗ trợ sự phát triển não bộ và hệ xương của thai nhi. Trong thời kỳ cho con bú, mẹ cũng cần duy trì chế độ ăn đa dạng, giàu dinh dưỡng để đảm bảo nguồn sữa chất lượng cho bé.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">4. Lời khuyên từ chuyên gia</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Ăn uống cân đối, đa dạng các nhóm thực phẩm mỗi ngày.</li>
                            <li>Bổ sung vitamin và khoáng chất theo hướng dẫn của bác sĩ, đặc biệt là axit folic, sắt, kẽm, canxi.</li>
                            <li>Uống đủ nước, hạn chế đồ uống có cồn và nước ngọt có gas.</li>
                            <li>Duy trì cân nặng hợp lý, tập thể dục đều đặn.</li>
                            <li>Khám sức khỏe định kỳ để phát hiện và điều chỉnh sớm các vấn đề về dinh dưỡng và sinh sản.</li>
                        </ul>
                        <p className="text-gray-700">
                            Dinh dưỡng hợp lý không chỉ giúp nâng cao sức khỏe sinh sản mà còn góp phần xây dựng một thế hệ tương lai khỏe mạnh. Hãy chủ động lựa chọn thực phẩm tốt và duy trì lối sống lành mạnh mỗi ngày!
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto rounded-lg shadow-md p-12 bg-gray-100 rounded mt-8 p-4">
                        <div className="flex items-center text-gray-600 mb-2 md:mb-0">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Cập nhật lần cuối: 20/04/2023
                        </div>
                    </div>  
                </div>
            </main>
            <Footer />
        </div>
    );
}