import React from 'react';
import { Reply } from 'lucide-react';

export default function QuestionsPanel({ questions, loading, error, selectedQuestion, setSelectedQuestion }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Câu hỏi từ khách hàng</h2>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow">
          {questions && questions.length > 0 ? (
  questions.map((q) => (
    <div key={q.id} className="p-4 border-b border-gray-200 last:border-b-0">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{q.user}</span>
            <span className="text-sm text-gray-500">{q.time}</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                q.status === 'Chưa trả lời'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {q.status}
            </span>
          </div>
          <p className="text-gray-700">{q.question}</p>
        </div>
        <button
          onClick={() => setSelectedQuestion(q)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Reply size={16} />
          Trả lời
        </button>
      </div>
    </div>
  ))
) : (
  <p className="text-gray-500 p-4">Không có câu hỏi nào.</p>
)}

          ))}
        </div>
      )}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold mb-4">Trả lời câu hỏi</h3>
            <p className="text-sm text-gray-600 mb-2">Từ: {selectedQuestion.user}</p>
            <p className="mb-4">{selectedQuestion.question}</p>
            <textarea 
              className="w-full border rounded p-2 mb-4" 
              rows="4" 
              placeholder="Nhập câu trả lời..."
            ></textarea>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Gửi trả lời
              </button>
              <button 
                onClick={() => setSelectedQuestion(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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