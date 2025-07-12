import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Edit, Trash2, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../../Component/Auth/AuthContext';
import { useToast } from '../../../Component/Toast/ToastProvider';
import api from '../../../Component/config/axios';

// Mẫu dữ liệu để hiển thị khi không có blogs
const sampleBlogs = [];

export default function BlogsPanel({ loading: externalLoading = false, error: externalError = null, onBlogCreated }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    categoryId: '',
    content: '',
    active: true
  });
  const [updatingBlog, setUpdatingBlog] = useState(false);
  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    content: ''
  });

  // State cho danh sách bài viết
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Thêm hàm xử lý chỉnh sửa bài viết
  const handleEditClick = (blog) => {
    setEditForm({
      id: blog.id,
      title: blog.title || '',
      categoryId: blog.categoryId?.id?.toString() || '',
      content: blog.content || '',
      active: blog.active !== undefined ? blog.active : true
    });
    setShowEditModal(true);
  };

  // Hàm xử lý thay đổi trường trong form chỉnh sửa
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Lấy danh sách bài viết khi component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch blogs từ API
  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/health-post');
      setBlogs(response.data || []);
    } catch (error) {
      console.error('Không thể tải bài viết:', error);
      setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
      showToast('Không thể tải danh sách bài viết', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Thêm state mới để lưu danh sách categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);

  // Lọc blogs theo consultant ID nếu cần
  const filteredBlogs = blogs
    .filter(blog => {
      // Nếu muốn chỉ hiển thị blog của consultant hiện tại
      // return blog.consultantId?.id === user.id;

      // Lọc theo tìm kiếm
      return searchTerm
        ? blog.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
    })
    .filter(blog => {
      // Lọc theo danh mục
      return categoryFilter === 'all'
        ? true
        : blog.categoryId?.id === Number(categoryFilter);
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.categoryId || !form.content) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/health-post', {
        consultantId: user.id,
        categoryId: Number(form.categoryId),
        title: form.title,
        content: form.content
      });

      showToast('Tạo bài viết thành công', 'success');
      setShowModal(false);

      // Reset form
      setForm({
        title: '',
        categoryId: '',
        content: ''
      });

      // Refresh danh sách blogs
      fetchBlogs();

      // Callback nếu có
      if (typeof onBlogCreated === 'function') {
        onBlogCreated();
      }
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      showToast(
        error.response?.data?.message || 'Không thể tạo bài viết mới',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Hàm xử lý submit form chỉnh sửa
  const handleUpdateBlog = async (e) => {
    e.preventDefault();

    if (!editForm.title || !editForm.categoryId || !editForm.content) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    setUpdatingBlog(true);
    try {
      await api.put(`/api/health-post/id/${editForm.id}`, {
        consultantId: user.id,
        categoryId: Number(editForm.categoryId),
        title: editForm.title,
        content: editForm.content,
        active: editForm.active
      });

      showToast('Cập nhật bài viết thành công', 'success');
      setShowEditModal(false);

      // Refresh danh sách blogs
      fetchBlogs();
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      showToast(
        error.response?.data?.message || 'Không thể cập nhật bài viết',
        'error'
      );
    } finally {
      setUpdatingBlog(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Thêm useEffect để lấy danh sách categories khi component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Hàm fetch categories từ API
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await api.get('/api/post-category/');
      console.log('Categories:', response.data); // Để kiểm tra dữ liệu

      // Bỏ qua việc filter theo id vì không có trường id
      setCategories(response.data || []);
    } catch (error) {
      console.error('Không thể tải danh mục:', error);
      showToast('Không thể tải danh mục bài viết', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  // Hàm hiển thị chi tiết category khi click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowCategoryDetails(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý blog</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} />
          Tạo bài viết mới
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {loadingCategories ? (
              <option disabled>Đang tải danh mục...</option>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.name} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>Không có danh mục</option>
            )}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="border rounded px-3 py-2 flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {filteredBlogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || categoryFilter !== 'all'
                ? 'Không tìm thấy bài viết nào phù hợp với bộ lọc'
                : 'Chưa có bài viết nào'}
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <div key={blog.id} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">{blog.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Danh mục: {blog.categoryId?.name || 'Không xác định'}</span>
                      <span>Tác giả: {blog.consultantId?.name || 'Không xác định'}</span>
                      <span>Trạng thái: {blog.active ? 'Hiển thị' : 'Ẩn'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                      title="Chỉnh sửa"
                      onClick={() => handleEditClick(blog)}
                    >
                      <Edit size={14} />
                      Sửa
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                      Xóa
                    </button>
                  </div>
                </div>
                {blog.content && (
                  <div className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {blog.content}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal chi tiết danh mục */}
      {showCategoryDetails && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCategoryDetails(false)}
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-6">
              Chi tiết danh mục: {selectedCategory.name}
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Thông tin</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>ID:</strong> {selectedCategory.id}
                  </p>
                  {selectedCategory.description && (
                    <p className="text-gray-700 mt-2">
                      <strong>Mô tả:</strong> {selectedCategory.description}
                    </p>
                  )}
                  <p className="text-gray-700 mt-2">
                    <strong>Trạng thái:</strong>{" "}
                    {selectedCategory.isActive !== undefined ? (
                      selectedCategory.isActive ? (
                        <span className="text-green-600">Đang hoạt động</span>
                      ) : (
                        <span className="text-red-600">Không hoạt động</span>
                      )
                    ) : (
                      <span className="text-green-600">Đang hoạt động</span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Bài viết thuộc danh mục này ({filteredBlogs.filter(blog =>
                    blog.categoryId?.id === selectedCategory.id
                  ).length})
                </h4>
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  {filteredBlogs.filter(blog =>
                    blog.categoryId?.id === selectedCategory.id
                  ).length > 0 ? (
                    filteredBlogs
                      .filter(blog => blog.categoryId?.id === selectedCategory.id)
                      .map(blog => (
                        <div key={blog.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50">
                          <h5 className="font-medium">{blog.title}</h5>
                          {blog.content && (
                            <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                              {blog.content}
                            </p>
                          )}
                        </div>
                      ))
                  ) : (
                    <p className="p-4 text-gray-500 text-center">
                      Không có bài viết nào trong danh mục này
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={() => setShowCategoryDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo bài viết mới */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-6">Tạo bài viết mới</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề bài viết"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {loadingCategories ? (
                    <option disabled>Đang tải danh mục...</option>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.name} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Không có danh mục</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập nội dung bài viết"
                  rows={8}
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Tạo bài viết
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl p-6 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowEditModal(false)}
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-bold mb-6">Chỉnh sửa bài viết</h3>

            <form onSubmit={handleUpdateBlog} className="space-y-5">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề bài viết"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={editForm.categoryId}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {loadingCategories ? (
                    <option disabled>Đang tải danh mục...</option>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <option key={category.name} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Không có danh mục</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={editForm.content}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập nội dung bài viết"
                  rows={8}
                  required
                ></textarea>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={editForm.active}
                    onChange={handleEditChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Hiển thị bài viết</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={updatingBlog}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  disabled={updatingBlog}
                >
                  {updatingBlog ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Edit size={16} />
                      Cập nhật
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}