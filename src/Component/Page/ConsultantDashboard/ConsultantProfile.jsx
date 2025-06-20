import React from "react";

export default function ConsultantProfile({ consultant, open, onClose }) {
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
            src={consultant.avatar || "https://i.pravatar.cc/100"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div className="font-semibold text-lg">{consultant.name}</div>
          <div className="text-sm text-gray-500">{consultant.role}</div>
        </div>
        <div className="text-sm space-y-1">
          <div>Email: <span className="text-gray-700">{consultant.email}</span></div>
          {consultant.specialty && (
            <div>Chuyên môn: <span className="text-gray-700">{consultant.specialty}</span></div>
          )}
          {consultant.phone && (
            <div>SĐT: <span className="text-gray-700">{consultant.phone}</span></div>
          )}
        </div>
      </div>
    </div>
  );
}
