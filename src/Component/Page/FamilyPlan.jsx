import React from 'react';
import LogoGHSMS from '../Logo/LogoGHSMS';
import Navigation from '../Nav/Navigation';
import Footer from '../Footer/Footer';
import { Link } from 'react-router';
import { Mail, Phone } from 'lucide-react';

export default function FamilyPlan(){

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
                    <header className="bg-white shadow-sm">
                                    <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Link to="/" className="mr-4">
                                                    <LogoGHSMS />
                                                </Link>
                                                <div className="hidden lg:block">
                                                    <h1 className="text-blue-700 font-semibold text-lg uppercase">Trung tâm Y học Giới tính TPHCM</h1>
                                                    <p className="text-gray-600 text-sm">Bệnh viện Nam học và Hiếm muộn TPHCM</p>
                                                    <p className="text-gray-500 text-xs">Center for Sexual Medicine of TPHCM</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-6">
                                                <div className="hidden md:flex items-center space-x-1">
                                                    <Mail size={16} className="text-blue-600" />
                                                    <span className="text-sm">ttyhgt@afTPHCM.com</span>
                                                </div>
                                                <div className="hidden md:flex items-center space-x-1">
                                                    <Phone size={16} className="text-blue-600" />
                                                    <span className="text-sm">0866.249.268</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">VN</button>
                                                    <button className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs">EN</button>
                                                </div>
                                            </div>
                                    </div>
                                <Navigation />
                    </header>
                    {/* Introduction Banner with Return Home */}
                    <div className="w-full bg-indigo-500 text-white py-4">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <h1 className="text-4xl font-bold mt-2">Quản lý kế hoạch hóa gia đình, tránh thai</h1>
                                <Link 
                                to="/" 
                                className="inline-flex items-center bg-white text-indigo-700 px-6 py-2 rounded-full font-medium hover:bg-indigo-50 transition-colors mb-1 transition-all duration-500 hover:scale-105"
                                >
                                Trang Chủ
                                </Link>
                            </div>
                        </div>
                    </div>

                    <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-purple-100 to-blue-50 py-16">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="container mx-auto px-4">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                                    Khái niệm kế hoạch hóa gia đình
                                </h1>
                                <p className="text-lg text-gray-700 mb-4">
                                    -Kế hoạch hóa gia đình là quá trình kiểm soát khả năng sinh con, điều chỉnh khoảng cách sinh con và số con trong gia đình.
                                     Có rất nhiều cách ngừa thai an toàn và hiệu quả, giúp các cặp vợ chồng thực hiện tốt kế hoạch hóa gia đình.
                                </p>
                                <p className="text-lg text-gray-700 mb-4">
                                    -Kế hoạch hóa gia đình bao gồm việc sử dụng cách ngừa thai tự nhiên, các biện pháp tránh thai, cách ngừa thai ngoài ý muốn và cả những cố gắng giúp cho các cặp vợ chồng khó sinh đẻ có thể mang thai. Có thể phân chia kế hoạch hóa gia đình làm 2 loại là kế hoạch hóa gia đình âm tính (giảm phát triển dân số) và kế hoạch hóa gia đình dương tính (tăng phát triển dân số). 
                                     Trong đó, chủ yếu là kế hoạch hóa gia đình nhằm giảm phát triển dân số, góp phần ổn định dân số, xây dựng xã hội phát triển.
                                </p>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                                    Lợi ích của kế hoạch hóa gia đình
                                </h1>
                                <p className="text-lg text-gray-700 mb-4">
                                    -Kế hoạch hóa gia đình giúp bảo vệ sức khỏe của người phụ nữ, giúp họ chủ động hơn trong việc mang thai, giảm đáng kể các ca nạo, phá thai có thể ảnh hưởng xấu đến sức khỏe và tinh thần của họ.
                                     Ngoài ra, kế hoạch hóa gia đình cũng giúp phụ nữ phòng tránh các bệnh lây nhiễm qua đường tình dục, các bệnh lý nguy hiểm như HIV/AIDS.
                                </p>
                                <div className="w-full mb-6 bg-gray-200 flex items-center justify-center rounded-lg transition-all duration-500 hover:scale-105">
                                    <img
                                        src="https://placehold.co/800x250/667eea/ffffff?text=Quản lý kế hoạch hóa gia đình"
                                        alt="Quản lý kế hoạch hóa gia đình"
                                        className="rounded-lg shadow-md w-full object-cover "
                                    />
                                </div>
                                <p className="text-lg text-gray-700 mb-4">
                                    -Kế hoạch hóa gia đình giúp đảm bảo chất lượng cuộc sống gia đình.
                                     Những đứa trẻ được sinh ra không theo đúng mong muốn của cha mẹ sẽ tạo nên áp lực tâm lý cho cả hai.
                                      Mỗi đứa trẻ sinh ra nên được nuôi dưỡng một cách đầy đủ để trẻ có thể phát triển toàn diện. 
                                      Nếu gia đình không có điều kiện đầy đủ để nuôi dưỡng đứa bé sẽ tạo nên áp lực kiếm tiền, tâm lý mệt mỏi, từ đó nảy sinh ra những mâu thuẫn không đáng có, đe dọa hạnh phúc vợ chồng.
                                </p>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-pink-600 mb-4 leading-tight">
                                   Phương pháp kế hoạch hóa gia đình
                                </h1>
                                <p className="text-lg text-gray-700 mb-4">
                                    Phương pháp tránh thai bằng bao cao su rất phổ biến, được hầu hết các cặp vợ chồng sử dụng. Bao cao su sẽ giúp giữ lại tinh trùng, ngăn không cho tinh trùng ra ngoài và tìm đến gặp trứng để thụ tinh. Khả năng tránh thai của bao cao su lên tới 99,98%, giúp các cặp vợ chồng yên tâm, chủ động với kế hoạch sinh con của mình.
                                </p>
                                <div className="w-full mb-6 bg-gray-200 flex items-center justify-center rounded-lg transition-all duration-500 hover:scale-105">
                                    <img
                                        src="https://placehold.co/800x250/667eea/ffffff?text=Quản lý kế hoạch hóa gia đình 2"
                                        alt="Quản lý kế hoạch hóa gia đình 22"
                                        className="rounded-lg shadow-md w-full object-cover "
                                    />
                                </div>
                                <p className="text-lg text-gray-700 mb-4">
                                   Tránh thai bằng bao cao su rất tiện lợi, không làm ảnh hưởng tới sức khỏe của cả 2 vợ chồng. Hơn nữa, bao cao su còn giúp ngăn ngừa các bệnh lây nhiễm qua đường tình dục. 
                                </p>
                            </div>
                        </div>
                    </main>
                    <Footer />
        </div>
    );
}