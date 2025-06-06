
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export default function Blog() {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const category = searchParams.get('category');

    const blogCategories = [
        { name: 'Sức khỏe sinh sản', slug: 'suc-khoe-sinh-san', count: 156 },
        { name: 'Sức khỏe giới tính', slug: 'suc-khoe-gioi-tinh', count: 127 },
        { name: 'Nam khoa', slug: 'nam-khoa', count: 98 },
        { name: 'Nữ khoa', slug: 'nu-khoa', count: 112 },
        { name: 'Bệnh xã hội', slug: 'benh-xa-hoi', count: 192 },
        
    ];

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
            category: 'Kế hoạch hóa gia đình',
            timestamp: '5 giờ trước',
            image: '/images/blog/contraception.jpg'
        },
        // Add more blog posts as needed
    ];

    useEffect(() => {
        // Filter posts based on category and search query
        let posts = [...recentPosts];
        
        if (category) {
            const categoryName = blogCategories.find(cat => cat.slug === category)?.name;
            posts = posts.filter(post => post.category === categoryName);
        }
        
        if (searchQuery) {
            posts = posts.filter(post => 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        setFilteredPosts(posts);
    }, [category, searchQuery]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="container mx-auto px-4 py-8 mt-24">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar */}
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Danh mục</h2>
                            <div className="space-y-3">
                                {blogCategories.map((category, index) => (
                                    <div key={index} className="flex justify-between items-center group cursor-pointer">
                                        <span className="text-gray-600 group-hover:text-blue-600">
                                            {category.name}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {category.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:w-3/4">
                        {/* Search Bar */}
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

                        {/* Blog Posts */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredPosts.map(post => (
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
                            ))}
                        </div>

                        {/* Newsletter Subscription */}
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
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}