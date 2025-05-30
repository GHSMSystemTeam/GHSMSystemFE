import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { Link } from "react-router-dom";

export default function NewsComponent1() {
    return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
        <Header/>
        {/* Introduction Banner with Return Home */}
        <div
        className="w-full text-white relative bg-cover bg-center min-h-[300px]"
        style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1500&q=80')"
        }}
        >
            <div className="absolute inset-0 bg-indigo-800 bg-opacity-40"></div>
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[300px]">
                    <h1
                    className="text-4xl font-bold text-white  text-center"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
                    >
                    Chăm sóc sức khỏe toàn diện cho phụ nữ mọi lứa tuổi
                    </h1>
            </div>
        </div>

        <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
            {/* Article Content */}
            <div className="container mx-auto px-4 py-12 flex-1">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-12">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
                        Sức khỏe phụ nữ – Nền tảng của hạnh phúc gia đình và xã hội
                    </h2>
                    <div className="rounded-lg w-full mb-6 bg-gray-200 flex items-center justify-center h-56 transition-all duration-500 hover:scale-105">
                        <img
                            src="https://afhanoi.com/wp-content/uploads/2022/09/.jpg"
                            alt="Sức khỏe phụ nữ"
                            className="rounded-lg w-full mb-6"
                        />
                    </div>
                    <p className="mb-4 text-gray-700 leading-relaxed">
                        Phụ nữ đóng vai trò quan trọng trong gia đình và xã hội. Việc chăm sóc sức khỏe toàn diện cho phụ nữ không chỉ giúp họ có một cuộc sống khỏe mạnh, hạnh phúc mà còn góp phần xây dựng một cộng đồng phát triển bền vững. Sức khỏe phụ nữ cần được quan tâm ở mọi lứa tuổi, từ tuổi dậy thì, sinh sản, tiền mãn kinh đến giai đoạn lão hóa.
                    </p>
                    <h3 className="text-xl font-medium text-indigo-600 mb-2">1. Chăm sóc sức khỏe tuổi dậy thì</h3>
                    <p className="mb-4 text-gray-700">
                        Tuổi dậy thì là giai đoạn cơ thể có nhiều thay đổi về thể chất và tâm sinh lý. Việc giáo dục sức khỏe sinh sản, hướng dẫn vệ sinh cá nhân, dinh dưỡng hợp lý và hỗ trợ tâm lý là rất cần thiết để các em gái phát triển toàn diện, tự tin và phòng tránh các bệnh lý phụ khoa.
                    </p>
                    <h3 className="text-xl font-medium text-indigo-600 mb-2">2. Sức khỏe sinh sản và thai sản</h3>
                    <p className="mb-4 text-gray-700">
                        Ở độ tuổi sinh sản, phụ nữ cần được tư vấn về kế hoạch hóa gia đình, khám phụ khoa định kỳ, tiêm phòng các bệnh lây truyền qua đường tình dục và chăm sóc sức khỏe trước, trong và sau khi mang thai. Việc này giúp phòng ngừa các biến chứng thai kỳ, đảm bảo sức khỏe cho mẹ và bé.
                    </p>
                    <h3 className="text-xl font-medium text-indigo-600 mb-2">3. Chăm sóc sức khỏe tiền mãn kinh và mãn kinh</h3>
                    <p className="mb-4 text-gray-700">
                        Giai đoạn tiền mãn kinh và mãn kinh thường đi kèm với nhiều thay đổi về nội tiết tố, ảnh hưởng đến tâm lý, giấc ngủ, xương khớp và tim mạch. Phụ nữ nên duy trì lối sống lành mạnh, tập thể dục đều đặn, bổ sung dinh dưỡng phù hợp và khám sức khỏe định kỳ để phát hiện sớm các bệnh lý thường gặp.
                    </p>
                    <h3 className="text-xl font-medium text-indigo-600 mb-2">4. Sức khỏe tinh thần và phòng ngừa bệnh tật</h3>
                    <p className="mb-4 text-gray-700">
                        Ngoài sức khỏe thể chất, sức khỏe tinh thần cũng rất quan trọng. Phụ nữ cần được chia sẻ, hỗ trợ tâm lý, giảm căng thẳng và duy trì các mối quan hệ xã hội tích cực. Đồng thời, việc tầm soát ung thư vú, ung thư cổ tử cung và các bệnh mãn tính như tiểu đường, tăng huyết áp là cần thiết để bảo vệ sức khỏe lâu dài.
                    </p>
                    <h3 className="text-xl font-medium text-indigo-600 mb-2">5. Lời khuyên từ chuyên gia</h3>
                    <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                        <li>Khám sức khỏe phụ khoa định kỳ ít nhất 1 lần/năm.</li>
                        <li>Ăn uống cân đối, bổ sung nhiều rau xanh, trái cây và uống đủ nước.</li>
                        <li>Tập thể dục thường xuyên, duy trì cân nặng hợp lý.</li>
                        <li>Giữ vệ sinh cá nhân sạch sẽ, đặc biệt trong kỳ kinh nguyệt.</li>
                        <li>Chủ động phòng ngừa các bệnh lây truyền qua đường tình dục.</li>
                        <li>Chia sẻ, tâm sự với người thân hoặc chuyên gia khi gặp vấn đề về tâm lý.</li>
                    </ul>
                    <p className="text-gray-700">
                        Chăm sóc sức khỏe toàn diện cho phụ nữ là hành trình lâu dài và cần sự đồng hành của gia đình, cộng đồng và các chuyên gia y tế. Hãy chủ động bảo vệ sức khỏe của mình để tận hưởng cuộc sống trọn vẹn và hạnh phúc!
                    </p>
                </div>
            </div>
        </main>
            <Footer/>
    </div>
    );
}