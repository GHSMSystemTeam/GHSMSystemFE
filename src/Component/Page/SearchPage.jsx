import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import LogoGHSMS from "../Logo/LogoGHSMS";
import { Mail, Phone } from "lucide-react";
import Navigation from "../Nav/Navigation";
import Header from "../Header/Header";

// Replace these with your real data or import them
const services = [
    { id: 1, title: "Khám sức khỏe sinh sản", excerpt: "Dịch vụ khám sức khỏe sinh sản", link: "/reproductive-manage", img: "/images/service1.jpg" },
    { id: 2, title: "Tư vấn STIs", excerpt: "Tư vấn điều trị các bệnh lây truyền qua đường tình dục.", link: "/sti-management", img: "/images/service2.jpg" },
    { id: 3, title: "Quản lý kế hoạch hóa gia đình, tránh thai", excerpt: "Lợi ích của kế hoạch hóa gia đình", link: "/family-plan", img: "/images/service3.jpg" },
];
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
            const serviceResults = services.filter(
                item => item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
            ).map(item => ({ ...item, type: "Dịch vụ" }));

            const aboutResults = aboutPages.filter(
                item => item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
            ).map(item => ({ ...item, type: "Giới thiệu" }));

            setResults([...serviceResults, ...aboutResults]);
            setLoading(false);
        }, 400);
    }, [query]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
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