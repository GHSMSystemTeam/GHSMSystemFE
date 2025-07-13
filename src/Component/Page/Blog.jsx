// Import api client
import api from '../config/axios';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../Header/Header';
import { Search } from 'lucide-react';
import Footer from '../Footer/Footer';

export default function Blog() {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const categorySlug = searchParams.get('category');

    // Hàm mở modal chi tiết bài viết
    const openPostModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    // Hàm đóng modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedPost(null);
    };

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const response = await api.get('/api/post-category/');
                console.log("Danh mục API:", response.data);

                // Chuyển đổi ID danh mục thành slug để sử dụng trong URL
                const categoriesWithSlugs = response.data
                    .filter(category => category.isActive) // Chỉ lấy danh mục active
                    .map(category => ({
                        id: category.id, // Lưu ID gốc
                        name: category.id, // ID chính là tên trong trường hợp này
                        slug: category.id.toLowerCase().replace(/\s+/g, '-')
                            .normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                        isActive: category.isActive,
                        count: 0 // Sẽ cập nhật sau
                    }));
                setCategories(categoriesWithSlugs);
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
                setError('Không thể tải danh mục bài viết');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/health-post/active');
                console.log("Bài viết active:", response.data);
                setPosts(response.data);

                // Cập nhật số lượng bài viết cho mỗi danh mục
                if (response.data && categories.length > 0) {
                    const updatedCategories = [...categories];
                    categories.forEach((cat, index) => {
                        // Debug để kiểm tra cấu trúc dữ liệu
                        console.log("Đang đếm cho danh mục:", cat);

                        const count = response.data.filter(post => {
                            // Kiểm tra nhiều cấu trúc khác nhau của categoryId
                            const postCatId = post.categoryId?.id || post.categoryId;
                            return postCatId === cat.id;
                        }).length;

                        updatedCategories[index].count = count;
                    });
                    setCategories(updatedCategories);
                }
            } catch (error) {
                console.error('Lỗi khi lấy bài viết:', error);
                setError('Không thể tải bài viết');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [categories.length]);

    // Filter posts based on category and search
    useEffect(() => {
        if (!posts) return;

        let filtered = [...posts];

        if (categorySlug) {
            const category = categories.find(cat => cat.slug === categorySlug);
            if (category) {
                filtered = filtered.filter(post => {
                    const postCatId = post.categoryId?.id || post.categoryId;
                    return postCatId === category.id;
                });
            }
        }

        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.categoryId?.id || post.categoryId || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredPosts(filtered);
    }, [categorySlug, searchQuery, posts, categories]);

    // Tạo function để format timestamp
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-50">
            <Header />

            <main className="container mx-auto px-4 py-8 mt-24">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Danh mục */}
                    <aside className="md:w-1/4">
                        <div className="space-y-3">
                            {/* Liên kết "Tất cả danh mục" */}
                            <Link
                                to="/blog"
                                className="flex justify-between items-center group cursor-pointer"
                            >
                                <span className={`text-gray-600 group-hover:text-blue-600 ${!categorySlug ? 'font-semibold text-blue-600' : ''}`}>
                                    Tất cả danh mục
                                </span>
                                <span className="text-sm text-gray-400">
                                    {posts.length}
                                </span>
                            </Link>

                            {/* Đường ngăn cách */}
                            <div className="border-b border-gray-200"></div>

                            {/* Danh sách các danh mục cụ thể */}
                            {categories.map((cat, index) => (
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

                            {/* Hiển thị thông báo nếu không có danh mục nào */}
                            {categories.length === 0 && (
                                <div className="text-gray-500 text-sm py-2">
                                    Chưa có danh mục nào
                                </div>
                            )}
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
                        {loading ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                                        <div className="w-full h-48 bg-gray-300"></div>
                                        <div className="p-4">
                                            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 p-4 rounded-lg text-red-600">
                                {error}
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredPosts.length > 0 ? (
                                    filteredPosts.map(post => (
                                        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                            {/* Placeholder image nếu không có ảnh thực */}
                                            <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                                <span className="text-lg text-blue-800 font-medium">Bài viết về sức khỏe</span>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600">
                                                    {post.title}
                                                </h3>
                                                <button
                                                    onClick={() => openPostModal(post)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-block"
                                                >
                                                    Đọc thêm →
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 col-span-2 text-center p-8">
                                        Không tìm thấy bài viết nào.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <Footer />

            {/* Modal hiển thị chi tiết bài viết */}
            {showModal && selectedPost && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        {/* Header modal */}
                        <div className="border-b p-4 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-800">{selectedPost.title}</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body modal */}
                        <div className="p-6">
                            {/* Thông tin bài viết */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <span className="text-blue-600 font-medium">
                                    {selectedPost.categoryId?.id || selectedPost.categoryId || 'Chung'}
                                </span>
                                <span>Đăng bởi: {selectedPost.consultantId?.name || 'Chuyên gia sức khỏe'}</span>
                            </div>

                            {/* Hình ảnh đại diện (nếu có) */}
                            <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-6">
                                <span className="text-lg text-blue-800 font-medium">Bài viết về sức khỏe</span>
                            </div>

                            {/* Nội dung bài viết */}
                            <div className="prose max-w-none">
                                {/* Hiển thị nội dung với định dạng */}
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: selectedPost.content
                                            .split('\n').join('<br />')  // Chuyển xuống dòng thành <br>
                                    }}
                                />
                            </div>
                        </div>

                        {/* Footer modal */}
                        <div className="border-t p-4 flex justify-end sticky bottom-0 bg-white">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}