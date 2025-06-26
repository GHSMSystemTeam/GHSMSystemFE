import React, { useState } from 'react';
import { FileText, Download, Eye, Upload, Calendar, User } from 'lucide-react';

export default function ExaminationsResult({ examinations, loading, error, onUpdateResult }) {
  const [selectedExam, setSelectedExam] = useState(null);
  const [resultFile, setResultFile] = useState(null);
  const [resultNotes, setResultNotes] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setResultFile(file);
  };

  const handleSubmitResult = (examId) => {
    if (resultFile || resultNotes) {
      onUpdateResult && onUpdateResult(examId, {
        file: resultFile,
        notes: resultNotes,
        submittedAt: new Date().toISOString()
      });
      setResultFile(null);
      setResultNotes('');
      setSelectedExam(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Đã có kết quả';
      case 'pending':
        return 'Chờ xét nghiệm';
      case 'processing':
        return 'Đang xét nghiệm';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kết quả xét nghiệm</h2>
        <div className="text-sm text-gray-600">
          Tổng số: {examinations?.length || 0} xét nghiệm
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Đang tải...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {examinations?.map((exam) => (
            <div key={exam.id} className="bg-white rounded-lg shadow border">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{exam.testName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        {getStatusText(exam.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Bệnh nhân: {exam.patientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Ngày lấy mẫu: {new Date(exam.sampleDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <span>Mã xét nghiệm: {exam.testCode}</span>
                      </div>
                      {exam.doctorName && (
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>Bác sĩ chỉ định: {exam.doctorName}</span>
                        </div>
                      )}
                    </div>

                    {exam.description && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm">{exam.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {exam.status === 'completed' && exam.resultFile && (
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                      <Download size={16} />
                      Tải kết quả
                    </button>
                  )}
                  
                  {exam.status === 'completed' && (
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
                      <Eye size={16} />
                      Xem kết quả
                    </button>
                  )}

                  {(exam.status === 'processing' || exam.status === 'pending') && (
                    <button 
                      onClick={() => setSelectedExam(selectedExam === exam.id ? null : exam.id)}
                      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Cập nhật kết quả
                    </button>
                  )}
                </div>

                {/* Form cập nhật kết quả */}
                {selectedExam === exam.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border-t">
                    <h4 className="font-medium mb-3">Cập nhật kết quả xét nghiệm</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tải lên file kết quả
                        </label>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ghi chú kết quả
                        </label>
                        <textarea
                          value={resultNotes}
                          onChange={(e) => setResultNotes(e.target.value)}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập ghi chú về kết quả xét nghiệm..."
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmitResult(exam.id)}
                          disabled={!resultFile && !resultNotes}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          Lưu kết quả
                        </button>
                        <button
                          onClick={() => setSelectedExam(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {examinations?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có xét nghiệm nào</h3>
              <p className="text-gray-500">Các xét nghiệm sẽ hiển thị tại đây khi có yêu cầu từ bệnh nhân.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
