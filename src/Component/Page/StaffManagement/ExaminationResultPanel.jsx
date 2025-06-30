import React, { useState, useEffect } from 'react';
import { FileText, Upload, Download, Eye, Send, Search, Filter, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import api from '../../config/axios';
import { useToast } from '../../Toast/ToastProvider';
import { useAuth } from '../../Auth/AuthContext';

const RESULT_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  DELIVERED: 2
};

const RESULT_STATUS_LABELS = {
  [RESULT_STATUS.PENDING]: 'Chờ kết quả',
  [RESULT_STATUS.COMPLETED]: 'Có kết quả',
  [RESULT_STATUS.DELIVERED]: 'Đã gửi'
};

function getResultStatusClass(status) {
  switch (status) {
    case RESULT_STATUS.PENDING: return 'bg-yellow-100 text-yellow-800';
    case RESULT_STATUS.COMPLETED: return 'bg-green-100 text-green-800';
    case RESULT_STATUS.DELIVERED: return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getResultStatusIcon(status) {
  switch (status) {
    case RESULT_STATUS.PENDING: return <Clock size={14} className="mr-1" />;
    case RESULT_STATUS.COMPLETED: return <CheckCircle size={14} className="mr-1" />;
    case RESULT_STATUS.DELIVERED: return <Send size={14} className="mr-1" />;
    default: return <AlertTriangle size={14} className="mr-1" />;
  }
}

export default function ExaminationResultPanel() {
  const [examinations, setExaminations] = useState([]);
  const [filteredExaminations, setFilteredExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedExam, setSelectedExam] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultForm, setResultForm] = useState({
    results: '',
    recommendations: '',
    notes: '',
    attachments: []
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchCompletedExaminations();
  }, []);

  useEffect(() => {
    let filtered = [...examinations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(exam => 
        exam.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.patient?.phoneNumber?.includes(searchTerm) ||
        exam.examinationTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.resultStatus === parseInt(statusFilter));
    }

    // Sort by examination date
    filtered.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

    setFilteredExaminations(filtered);
  }, [examinations, searchTerm, statusFilter]);

  const fetchCompletedExaminations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/exam-bookings/completed');
      setExaminations(response.data || []);
    } catch (err) {
      console.error('Error fetching completed examinations:', err);
      showToast('Lỗi khi tải danh sách xét nghiệm', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResultModal = (exam) => {
    setSelectedExam(exam);
    setResultForm({
      results: exam.results || '',
      recommendations: exam.recommendations || '',
      notes: exam.notes || '',
      attachments: exam.attachments || []
    });
    setShowResultModal(true);
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('examId', selectedExam.id);
        
        const response = await api.post('/api/exam-results/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return response.data;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      setResultForm(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles]
      }));

      showToast('Tải lên file thành công', 'success');
    } catch (err) {
      console.error('Error uploading files:', err);
      showToast('Lỗi khi tải lên file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitResult = async () => {
    if (!resultForm.results.trim()) {
      showToast('Vui lòng nhập kết quả xét nghiệm', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const resultData = {
        examId: selectedExam.id,
        results: resultForm.results,
        recommendations: resultForm.recommendations,
        notes: resultForm.notes,
        attachments: resultForm.attachments,
        resultStatus: RESULT_STATUS.COMPLETED,
        completedAt: new Date().toISOString()
      };

      await api.post('/api/exam-results', resultData);

      // Update local state
      setExaminations(prev =>
        prev.map(exam =>
          exam.id === selectedExam.id
            ? { ...exam, ...resultData, resultStatus: RESULT_STATUS.COMPLETED }
            : exam
        )
      );

      showToast('Đã lưu kết quả xét nghiệm thành công', 'success');
      setShowResultModal(false);
      setSelectedExam(null);
      
    } catch (err) {
      console.error('Error submitting result:', err);
      showToast('Lỗi khi lưu kết quả xét nghiệm', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendResult = async (examId) => {
    try {
      await api.post(`/api/exam-results/${examId}/send`);
      
      setExaminations(prev =>
        prev.map(exam =>
          exam.id === examId
            ? { ...exam, resultStatus: RESULT_STATUS.DELIVERED, sentAt: new Date().toISOString() }
            : exam
        )
      );

      showToast('Đã gửi kết quả cho bệnh nhân', 'success');
    } catch (err) {
      console.error('Error sending result:', err);
      showToast('Lỗi khi gửi kết quả', 'error');
    }
  };

  const handleDownloadResult = async (examId) => {
    try {
      const response = await api.get(`/api/exam-results/${examId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ket-qua-xet-nghiem-${examId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error downloading result:', err);
      showToast('Lỗi khi tải xuống kết quả', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const removeAttachment = (index) => {
    setResultForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Chờ kết quả</p>
              <p className="text-2xl font-bold text-yellow-800">
                {examinations.filter(e => e.resultStatus === RESULT_STATUS.PENDING).length}
              </p>
            </div>
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Có kết quả</p>
              <p className="text-2xl font-bold text-green-800">
                {examinations.filter(e => e.resultStatus === RESULT_STATUS.COMPLETED).length}
              </p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Đã gửi</p>
              <p className="text-2xl font-bold text-blue-800">
                {examinations.filter(e => e.resultStatus === RESULT_STATUS.DELIVERED).length}
              </p>
            </div>
            <Send className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Tên bệnh nhân, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái kết quả
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value={RESULT_STATUS.PENDING}>Chờ kết quả</option>
              <option value={RESULT_STATUS.COMPLETED}>Có kết quả</option>
              <option value={RESULT_STATUS.DELIVERED}>Đã gửi</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Examinations Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bệnh nhân
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại xét nghiệm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày xét nghiệm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái kết quả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExaminations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Không có dữ liệu xét nghiệm
                  </td>
                </tr>
              ) : (
                filteredExaminations.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {exam.patient?.fullName || exam.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {exam.patient?.email || exam.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {exam.patient?.phoneNumber || exam.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {exam.examinationTypeName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(exam.appointmentDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getResultStatusClass(exam.resultStatus || RESULT_STATUS.PENDING)}`}>
                        {getResultStatusIcon(exam.resultStatus || RESULT_STATUS.PENDING)}
                        {RESULT_STATUS_LABELS[exam.resultStatus || RESULT_STATUS.PENDING]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenResultModal(exam)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Nhập/Xem kết quả"
                        >
                          <FileText size={16} />
                        </button>

                        {exam.resultStatus === RESULT_STATUS.COMPLETED && (
                          <>
                            <button
                              onClick={() => handleSendResult(exam.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Gửi kết quả"
                            >
                              <Send size={16} />
                            </button>
                            <button
                              onClick={() => handleDownloadResult(exam.id)}
                              className="text-purple-600 hover:text-purple-900 p-1 rounded"
                              title="Tải xuống"
                            >
                              <Download size={16} />
                            </button>
                          </>
                        )}

                        {exam.resultStatus === RESULT_STATUS.DELIVERED && (
                          <button
                            onClick={() => handleDownloadResult(exam.id)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded"
                            title="Tải xuống"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                Kết quả xét nghiệm - {selectedExam.patient?.fullName || selectedExam.fullName}
              </h3>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Thông tin bệnh nhân</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Họ tên:</strong> {selectedExam.patient?.fullName || selectedExam.fullName}</div>
                  <div><strong>Email:</strong> {selectedExam.patient?.email || selectedExam.email}</div>
                  <div><strong>Điện thoại:</strong> {selectedExam.patient?.phoneNumber || selectedExam.phoneNumber}</div>
                  <div><strong>Ngày xét nghiệm:</strong> {formatDate(selectedExam.appointmentDate)}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-3">Thông tin xét nghiệm</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Loại xét nghiệm:</strong> {selectedExam.examinationTypeName}</div>
                  <div><strong>Trạng thái:</strong> 
                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs ${getResultStatusClass(selectedExam.resultStatus || RESULT_STATUS.PENDING)}`}>
                      {RESULT_STATUS_LABELS[selectedExam.resultStatus || RESULT_STATUS.PENDING]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kết quả xét nghiệm *
                </label>
                <textarea
                  value={resultForm.results}
                  onChange={(e) => setResultForm(prev => ({ ...prev, results: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập kết quả xét nghiệm chi tiết..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khuyến nghị
                </label>
                <textarea
                  value={resultForm.recommendations}
                  onChange={(e) => setResultForm(prev => ({ ...prev, recommendations: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập khuyến nghị cho bệnh nhân..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={resultForm.notes}
                  onChange={(e) => setResultForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú thêm..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File đính kèm
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Đang tải lên...' : 'Nhấn để chọn file hoặc kéo thả file vào đây'}
                    </span>
                  </label>
                </div>

                {resultForm.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {resultForm.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700">{file.filename || file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
              <button
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitResult}
                disabled={submitting || !resultForm.results.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang lưu...' : 'Lưu kết quả'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
