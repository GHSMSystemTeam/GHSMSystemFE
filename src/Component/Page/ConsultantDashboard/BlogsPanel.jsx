import React from 'react';
import { Plus, Filter, Search, Edit, Trash2 } from 'lucide-react';

export default function BlogsPanel({ blogs = [], loading = false, error = null }) {
  // Sử dụng dữ liệu mẫu nếu blogs rỗng
  const displayBlogs = blogs.length > 0 ? blogs : sampleBlogs;
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý blog</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Plus size={16} />
          Tạo bài viết mới
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <select className="border rounded px-3 py-2">
            <option>Tất cả danh mục</option>
            <option>Nam Khoa</option>
            <option>Nữ Khoa</option>
            <option>Sức khỏe Tâm Lý</option>
            <option>Sức khỏe Sinh Sản</option>
            <option>Bệnh Truyền Nhiễm</option>
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Search size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="border rounded px-3 py-2 flex-1"
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
          {displayBlogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Chưa có bài viết nào
            </div>
          ) : (
            displayBlogs.map((blog) => (
              <div key={blog.id} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">{blog.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Danh mục: {blog.category}</span>
                      <span>{blog.views} lượt xem</span>
                      <span>{blog.comments} bình luận</span>
                      <span>{blog.date}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                      Xem bình luận
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      <Edit size={14} />
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 