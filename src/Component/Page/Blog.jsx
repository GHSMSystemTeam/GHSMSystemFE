import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export default function Blog() {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);

    const categorySlug = searchParams.get('category'); // Ví dụ: "nam-khoa"

    const blogCategories = [
        { name: 'Sức khỏe sinh sản', slug: 'suc-khoe-sinh-san',  },
        { name: 'Sức khỏe giới tính', slug: 'suc-khoe-gioi-tinh',  },
        { name: 'Nam khoa', slug: 'nam-khoa',  },
        { name: 'Nữ khoa', slug: 'nu-khoa',  },
        { name: 'Bệnh xã hội', slug: 'benh-xa-hoi', },
    ];

    // Giả lập dữ liệu bài viết (sau này thay bằng API fetch)
    const recentPosts = [
        {
            id: 1,
            title: 'Chu kỳ kinh nguyệt không đều - Nguyên nhân và cách điều trị',
            category: 'Sức khỏe sinh sản',
            timestamp: '2 giờ trước',
            image: '/images/blog/menstrual-cycle.jpg'
        },
        {
            id: 2,
            title: 'Các phương pháp tránh thai hiện đại và an toàn',
            category: 'Sức khỏe giới tính',
            timestamp: '5 giờ trước',
            image: '/images/blog/contraception.jpg'
        },
        {
            id: 3,
            title: 'Dấu hiệu và điều trị bệnh viêm tuyến tiền liệt ở nam giới',
            category: 'Nam khoa',
            timestamp: '1 ngày trước',
            image: '/images/blog/prostate.jpg'
        },
        {
            id: 4,
            title: 'Khám phụ khoa định kỳ quan trọng như thế nào?',
            category: 'Nữ khoa',
            timestamp: '3 ngày trước',
            image: '/images/blog/gynecology.jpg'
        },
    ];

    useEffect(() => {
        let posts = [...recentPosts];

        if (categorySlug) {
            const categoryName = blogCategories.find(cat => cat.slug === categorySlug)?.name;
            posts = posts.filter(post => post.category === categoryName);
        }

        if (searchQuery) {
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredPosts(posts);
    }, [categorySlug, searchQuery]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-50">
            <Header />

            <main className="container mx-auto px-4 py-8 mt-24">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Danh mục */}
                    <aside className="md:w-1/4">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Danh mục</h2>
                            <div className="space-y-3">
                                {blogCategories.map((cat, index) => (
                                    <Link
                                        key={index}
                                        to={`/blog?category=${cat.slug}`}
                                        className="flex justify-between items-center group cursor-pointer"
                                    >
                                        <span className={`text-gray-600 group-hover:text-blue-600 ${categorySlug === cat.slug ? 'font-semibold text-blue-600' : ''}`}>
                                            {cat.name}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {cat.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Nội dung chính */}
                    <section className="md:w-3/4">
                        {/* Thanh tìm kiếm */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                            </div>
                        </div>

                        {/* Danh sách bài viết */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map(post => (
                                    <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-blue-600">{post.category}</span>
                                                <span className="text-sm text-gray-500">{post.timestamp}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600">
                                                {post.title}
                                            </h3>
                                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                Đọc thêm →
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Không tìm thấy bài viết nào.</p>
                            )}
                        </div>

                        {/* Đăng ký nhận bản tin */}
                        <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mt-8">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-4 md:mb-0">
                                    <h3 className="text-xl font-bold mb-2">
                                        Nhận thông tin sức khỏe mới nhất
                                    </h3>
                                    <p className="text-blue-100">
                                        Đăng ký để nhận các bài viết và tư vấn miễn phí
                                    </p>
                                </div>
                                <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                                    Đăng ký ngay
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
