import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import LogoGHSMS from "../Logo/LogoGHSMS";
import { Mail, Phone } from "lucide-react";
import Navigation from "../Nav/Navigation";
import Header from "../Header/Header";

// Replace these with your real data or import them
const news = [
    {id:1, title:"Chăm sóc sức khỏe toàn diện cho phụ nữ mọi lứa tuổi", excerpt:"Phòng khám của chúng tôi cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho phụ nữ ở mọi giai đoạn cuộc sống, từ thanh thiếu niên đến tuổi trung niên và cao tuổi.", link:"/cham-soc-suc-khoe-phu-nu", img:"/images/news1.jpg"},
    {id:2, title:"Tư vấn sức khỏe sinh sản cho nam giới", excerpt:"Dịch vụ tư vấn sức khỏe sinh sản dành cho nam giới giúp nâng cao nhận thức và đảm bảo sức khỏe tối ưu.", link:"/news/tu-van-suc-khoe-nam-gioi", img:"/images/news2.jpg"},
    {id:3, title:"Tầm quan trọng của khám sức khỏe định kỳ cho phụ nữ", excerpt:"Khám sức khỏe định kỳ đóng vai trò quan trọng trong việc phát hiện sớm và phòng ngừa các vấn đề sức khỏe phụ nữ.", link:"/news/kham-suc-khoe-dinh-ky-phu-nu", img:"/images/news3.jpg"},
    {id:4, title:"Sức khỏe tâm lý và giới tính - Mối liên hệ quan trọng", excerpt:"Nghiên cứu mới cho thấy mối liên hệ mật thiết giữa sức khỏe tâm lý và các vấn đề về giới tính, cách tiếp cận toàn diện.", link:"/news/suc-khoe-tam-ly-gioi-tinh", img:"/images/news4.jpg"},
    {id:5, title:"Dinh dưỡng và sức khỏe sinh sản", excerpt:"Chế độ dinh dưỡng đóng vai trò quan trọng trong việc duy trì sức khỏe sinh sản cho cả nam và nữ.", link:"/news/dinh-duong-suc-khoe-sinh-san", img:"/images/news5.jpg"},
    {id:6, title:"Các phương pháp tránh thai hiện đại và an toàn", excerpt:"Tổng quan về các phương pháp tránh thai hiện đại, ưu nhược điểm và cách lựa chọn phù hợp với từng cá nhân.", link:"/news/phuong-phap-tranh-thai", img:"/images/news6.jpg"},
]
const aboutPages = [
    { id: 1, title: "Về Trung tâm", excerpt: "Giới thiệu về Trung tâm Y học Giới tính TPHCM.", link: "/about", img: "/images/about1.jpg" },
    { id: 2, title: "Đội ngũ chuyên môn", excerpt: "Thông tin về đội ngũ bác sĩ, chuyên gia.", link: "/dncm", img: "/images/about2.jpg" },
    { id: 3, title: "Tin tức báo chí", excerpt: "Cập nhật tin tức mới nhất từ Trung tâm.", link: "/news", img: "/images/about3.jpg" },
];

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
    const query = useQuery().get("query") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            // Filter both sources
            const q = query.toLowerCase();
            const newsResults = news.filter(
                item => item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
            ).map(item => ({ ...item, type: "Tin tức", link: `/news/${item.id}`, img: item.img || "/images/default.jpg" }));

            const aboutResults = aboutPages.filter(
                item => item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
            ).map(item => ({ ...item, type: "Giới thiệu" }));

            setResults([...aboutResults, ...newsResults]);
            setLoading(false);
        }, 400);
    }, [query]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-24 mt-10">
            {/* Header */}
            <Header />
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 flex-1">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-2xl font-bold mb-6">
                        Kết quả tìm kiếm cho: <span className="text-blue-600">"{query}"</span>
                    </h1>
                    {loading ? (
                        <div className="text-center text-gray-500 py-12">Đang tìm kiếm...</div>
                    ) : results.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            Không tìm thấy kết quả phù hợp.
                        </div>
                    ) : (
                        <ul className="space-y-6">
                            {results.map(item => (
                                <li 
                                    key={item.type + item.id}
                                    className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow min-h-[300px] transition-all duration-500 hover:scale-105">
                                    <img
                                        src={item.img || "/images/default.jpg"}
                                        alt={item.title}
                                        className="max-h-[420px] object-cover rounded-lg flex-shrink-0 border mb-4 min-h-[250px]"  
                                     />
                                    <a href={item.link} className="block">
                                        <span className="text-xs text-gray-400">{item.type}</span>
                                        <h2 className="text-lg font-semibold text-blue-700 hover:underline mb-2">{item.title}</h2>
                                        <p className="text-gray-600">{item.excerpt}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
            <Footer />
        </div>

    );
}