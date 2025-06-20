import React from "react";

export default function ConsultantProfile({ consultant }) {
  return (
    <div className="fixed top-6 right-6 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={consultant.avatar || "https://i.pravatar.cc/100"}
          alt="avatar"
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <div className="font-semibold text-lg">{consultant.name}</div>
          <div className="text-sm text-gray-500">{consultant.role}</div>
        </div>
      </div>
      <div className="text-sm">
        <div>Email: <span className="text-gray-700">{consultant.email}</span></div>
        <div>Chuyên môn: <span className="text-gray-700">{consultant.specialty}</span></div>
      </div>
    </div>
  );
}
