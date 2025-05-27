import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import LogoGHSMS from "../Logo/LogoGHSMS";
import { Mail, Phone } from "lucide-react";
import Navigation from "../Nav/Navigation";

// Replace these with your real data or import them
const services = [
    { id: 1, title: "Khám sức khỏe sinh sản", excerpt: "Dịch vụ khám sức khỏe sinh sản", link: "/reproductive-manage" },
    { id: 2, title: "Tư vấn STIs", excerpt: "Tư vấn điều trị các bệnh lây truyền qua đường tình dục.", link: "/sti-management" }
];
const aboutPages = [
    { id: 1, title: "Về Trung tâm", excerpt: "Giới thiệu về Trung tâm Y học Giới tính TPHCM.", link: "/about" },
    { id: 2, title: "Đội ngũ chuyên môn", excerpt: "Thông tin về đội ngũ bác sĩ, chuyên gia.", link: "/dncm" }
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
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="mr-4">
                            <LogoGHSMS/>
                        </Link>
                        <div className="hidden lg:block">
                            <h1 className="text-blue-700 font-semibold text-lg uppercase">Trung tâm Y học Giới tính TPHCM</h1>
                            <p className="text-gray-600 text-sm">Bệnh viện Nam học và Hiếm muộn TPHCM</p>
                            <p className="text-gray-500 text-xs">Center for Sexual Medicine of HCM city</p>
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
                {/* Navigation */} 
                <Navigation />
            </header>
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
                                <li key={item.type + item.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
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
             <Footer/>  
        </div>
     
    );
}