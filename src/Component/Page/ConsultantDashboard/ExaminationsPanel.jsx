import React from 'react';

export default function ExaminationsPanel({ examTab, setExamTab, examBookings, examResults, loading, error }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dịch vụ xét nghiệm</h2>
      </div>
      <div className="mb-4">
        <div className="flex border-b">
          <button
            onClick={() => setExamTab('bookings')}
            className={`px-4 py-2 ${examTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Lịch đặt xét nghiệm
          </button>
          <button
            onClick={() => setExamTab('results')}
            className={`px-4 py-2 ${examTab === 'results' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Trả kết quả xét nghiệm
          </button>
        </div>
      </div>
      {examTab === 'bookings' ? (
        loading.examBookings ? (
          <p>Đang tải...</p>
        ) : error.examBookings ? (
          <p className="text-red-500">{error.examBookings}</p>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {examBookings.map((booking) => (
              <div key={booking.id} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{booking.user}</h3>
                    <p className="text-sm text-gray-600">{booking.service}</p>
                    <p className="text-sm text-gray-500">Ngày đặt: {booking.date}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                      booking.status === 'Đã lấy mẫu' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Cập nhật trạng thái
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        loading.examResults ? (
          <p>Đang tải...</p>
        ) : error.examResults ? (
          <p className="text-red-500">{error.examResults}</p>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {examResults.map((result) => (
              <div key={result.id} className="p-4 border-b border-gray-200 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{result.user}</h3>
                    <p className="text-sm text-gray-600">{result.service}</p>
                    <p className="text-sm text-gray-500">Ngày xét nghiệm: {result.date}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                      result.status === 'Đã trả kết quả' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Tải file kết quả
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Gửi kết quả
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
} 