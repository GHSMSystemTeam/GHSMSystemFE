import React from 'react';
import { Plus, Edit } from 'lucide-react';

export default function ServicesPanel({ services, loading, error }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý dịch vụ</h2>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {services.map((service) => (
            <div key={service.id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                  <p className="text-lg font-bold text-blue-600 mt-1">{service.price}</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                  <Edit size={16} />
                  Chỉnh sửa
                </button>
              </div>
            </div>
          ))}
          <div className="p-4 text-center">
            <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 flex items-center gap-2 mx-auto">
              <Plus size={16} />
              Thêm dịch vụ mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 