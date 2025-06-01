import Footer from "../Footer/Footer";
import Header from "../Header/Header";

export default function NewsComponent4() {
    return ( 
         <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
            <Header />
            {/* Banner */}
            <div
                className="w-full text-white relative bg-cover bg-center min-h-[300px]"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-indigo-800 bg-opacity-40"></div>
                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                    <h1
                        className="text-4xl font-bold text-white text-center"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                    >
                        Sức khỏe tâm lý và giới tính - Mối liên hệ quan trọng
                    </h1>
                </div>
            </div>
            <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
                <div className="container mx-auto px-4 py-12 flex-1">
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                            Sức khỏe tâm lý và giới tính: Hiểu đúng để sống khỏe mạnh và hạnh phúc
                        </h2>
                        <div className="rounded-lg w-full mb-6 bg-gray-200 flex items-center justify-center h-40 transition-all duration-500 hover:scale-105 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1512070679279-c5a4b67c1d53?auto=format&fit=crop&w=800&q=80"
                                alt="Sức khỏe tâm lý và giới tính"
                                className="rounded-lg w-full h-full object-contain"
                            />
                        </div>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Sức khỏe tâm lý và giới tính là hai yếu tố có mối liên hệ mật thiết, ảnh hưởng sâu sắc đến chất lượng cuộc sống của mỗi người. Khi tâm lý ổn định, con người sẽ có cái nhìn tích cực về bản thân, giới tính và các mối quan hệ xã hội. Ngược lại, những rối loạn tâm lý có thể dẫn đến những khó khăn trong việc nhận diện và chấp nhận giới tính, cũng như ảnh hưởng đến sức khỏe tổng thể.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">1. Tâm lý ảnh hưởng đến nhận thức giới tính</h3>
                        <p className="mb-4 text-gray-700">
                            Quá trình hình thành và phát triển nhận thức về giới tính chịu tác động lớn từ môi trường gia đình, xã hội và đặc biệt là sức khỏe tâm lý. Một tâm lý vững vàng giúp cá nhân tự tin khẳng định bản thân, tôn trọng sự đa dạng giới và xây dựng các mối quan hệ lành mạnh.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">2. Rối loạn tâm lý và các vấn đề về giới</h3>
                        <p className="mb-4 text-gray-700">
                            Những áp lực xã hội, định kiến về giới hoặc trải nghiệm tiêu cực có thể dẫn đến các rối loạn tâm lý như lo âu, trầm cảm, rối loạn nhận dạng giới. Nếu không được hỗ trợ kịp thời, những vấn đề này có thể ảnh hưởng nghiêm trọng đến sức khỏe thể chất và tinh thần.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">3. Vai trò của gia đình và cộng đồng</h3>
                        <p className="mb-4 text-gray-700">
                            Gia đình và cộng đồng đóng vai trò quan trọng trong việc tạo dựng môi trường an toàn, tôn trọng và hỗ trợ cho mỗi cá nhân phát triển toàn diện về tâm lý và giới tính. Sự lắng nghe, chia sẻ và đồng hành sẽ giúp giảm thiểu các rối loạn tâm lý và thúc đẩy sự hòa nhập xã hội.
                        </p>
                        <h3 className="text-xl font-medium text-indigo-600 mb-2">4. Lời khuyên từ chuyên gia</h3>
                        <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                            <li>Chủ động tìm kiếm sự hỗ trợ tâm lý khi gặp khó khăn về cảm xúc hoặc nhận diện giới tính.</li>
                            <li>Tham gia các hoạt động xã hội, nhóm hỗ trợ để tăng cường sự tự tin và kỹ năng giao tiếp.</li>
                            <li>Giữ lối sống lành mạnh, cân bằng giữa công việc, học tập và nghỉ ngơi.</li>
                            <li>Chia sẻ với người thân hoặc chuyên gia tâm lý khi cảm thấy áp lực hoặc bị kỳ thị.</li>
                        </ul>
                        <p className="text-gray-700">
                            Sức khỏe tâm lý và giới tính là nền tảng cho một cuộc sống hạnh phúc và thành công. Hãy quan tâm, chăm sóc bản thân và lan tỏa sự thấu hiểu, tôn trọng đến mọi người xung quanh!
                        </p>
                    </div>
                    <div className="max-w-5xl mx-auto rounded-lg shadow-md p-12 bg-gray-100 rounded mt-8 p-4">
                        <div className="flex items-center text-gray-600 mb-2 md:mb-0">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Cập nhật lần cuối: 28/04/2023
                        </div>
                    </div>                  
                </div>
            </main>
            <Footer />
        </div>       
    );
}