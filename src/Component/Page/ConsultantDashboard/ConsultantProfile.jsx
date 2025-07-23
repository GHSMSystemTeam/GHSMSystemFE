import React from "react";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ConsultantProfile({ consultant, open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Xóa token nếu có
      localStorage.removeItem('authToken');

      // Gọi logout từ AuthContext
      logout();

      // Hiển thị thông báo thành công
      toast.success("Đăng xuất thành công!");

      // Đóng modal profile
      onClose();

      // Chuyển hướng về trang chủ
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất!");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80 relative animate-fadeIn">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Đóng"
        >
          &times;
        </button>
        <div className="flex flex-col items-center gap-3 mb-3">
          <img
            src={consultant.avatar || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzciIHI9IjE1IiBmaWxsPSIjOUI5QkExIi8+CjxwYXRoIGQ9Ik0yMCA3NkMyMCA2OC4yODQzIDI2LjI4NDMgNjIgMzQgNjJINjZDNzMuNzE1NyA2MiA4MCA2OC4yODQzIDgwIDc2VjEwMEgyMFY3NloiIGZpbGw9IiM5QjlCQTEiLz4KPC9zdmc+"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div className="font-semibold text-lg">{consultant.name}</div>
          <div className="text-sm text-gray-500">{consultant.role}</div>
        </div>        <div className="text-sm space-y-1">
          <div>Email: <span className="text-gray-700">{consultant.email}</span></div>
          {consultant.specialty && (
            <div>Chuyên môn: <span className="text-gray-700">{consultant.specialty}</span></div>
          )}
          {consultant.phone && (
            <div>SĐT: <span className="text-gray-700">{consultant.phone}</span></div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
