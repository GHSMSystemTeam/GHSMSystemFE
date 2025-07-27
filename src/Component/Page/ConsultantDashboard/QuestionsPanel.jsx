import React, { useState, useEffect } from 'react';
import {
  Reply,
  AlertCircle,
  Check,
  Clock,
  X,
  Search,
  MessageSquare,
  Calendar,
  User,
  Eye,
  Filter,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import api from '../../../Component/config/axios';
import { useToast } from '../../../Component/Toast/ToastProvider';
import { useAuth } from '../../../Component/Auth/AuthContext';

export default function QuestionsPanel({ questions: externalQuestions, loading: externalLoading, error: externalError, selectedQuestion, setSelectedQuestion, fetchQuestions }) {
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [internalQuestions, setInternalQuestions] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const { showToast } = useToast();
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [answerToDelete, setAnswerToDelete] = useState(null);

  // Danh sách các thẻ tags thông dụng
  const tags = ["Sức khỏe sinh sản", "Nam khoa", "Phụ khoa", "Bệnh lây truyền", "Sức khỏe tình dục", "Tâm lý"];

  // Sử dụng câu hỏi từ props nếu có, ngược lại sử dụng state nội bộ
  const questions = (externalQuestions && externalQuestions.length > 0) ? externalQuestions : internalQuestions;
  const loading = externalLoading || internalLoading;
  const error = externalError || internalError;

  // Chỉ fetch dữ liệu khi không có props questions từ bên ngoài
  useEffect(() => {
    if (!externalQuestions) {
      fetchQuestionsFromAPI();
    }
  }, [externalQuestions]);

  const fetchQuestionsFromAPI = async () => {
    try {
      setInternalLoading(true);
      setInternalError(null);

      const response = await api.get('/api/question/active');
      console.log('API response raw data:', response.data);

      if (!response.data || !Array.isArray(response.data)) {
        setInternalQuestions([]);
        return;
      }

      // Map dữ liệu giống Consulation
      const formattedQuestions = response.data.map(q => ({
        id: q.id,
        userId: q.customer?.id || q.customerId,
        userName: q.customer?.name || "Người dùng ẩn danh",
        title: q.title,
        content: q.content,
        date: q.createDate,
        tags: q.tags || [],
        views: q.views || 0,
        likes: q.likes || 0,
        status: q.answers && q.answers.length > 0 ? 'Đã trả lời' : 'Chưa trả lời',
        answers: q.answers?.map(a => ({
          id: a.id,
          doctorId: a.user?.id,
          doctorName: a.user?.name || "Bác sĩ",
          content: a.answerContent,
          date: a.createDate,
          likes: a.rating || 0
        })) || []
      }));

      setInternalQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error details:', error);
      setInternalError('Không thể tải danh sách câu hỏi. Vui lòng thử lại sau.');
    } finally {
      setInternalLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      showToast('Vui lòng nhập nội dung câu trả lời', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const answerPayload = {
        questionId: selectedQuestion.id,
        consultantId: user.id, // hoặc doctorId nếu backend yêu cầu
        title: selectedQuestion.title,
        content: answer,
        createDate: new Date().toISOString(),
        rating: 0,
        isPublic: true
      };

      await api.post('/api/answer', answerPayload);

      showToast('Câu trả lời đã được gửi thành công!', 'success');

      // Làm mới danh sách câu hỏi
      if (fetchQuestions) {
        fetchQuestions();
      } else {
        fetchQuestionsFromAPI();
      }

      setAnswer('');
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Không thể gửi câu trả lời. Vui lòng thử lại sau!';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusBadge = (status) => {
    if (status === 'Đã trả lời') {
      return (
        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 flex items-center">
          <Check size={12} className="mr-1" />
          {status}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800 flex items-center">
        <Clock size={12} className="mr-1" />
        {status}
      </span>
    );
  };

  const handleLikeAnswer = (questionId, answerId) => {
    // Trong tương lai có thể thêm API để bác sĩ đánh giá câu trả lời của đồng nghiệp
    showToast('Chức năng đang được phát triển', 'info');
  };

  const toggleAnswerVisibility = (questionId) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleAskDeleteAnswer = (answerId) => {
    setAnswerToDelete(answerId);
    setShowDeleteModal(true);
  };

  const handleDeleteAnswer = async () => {
    if (!answerToDelete) return;
    console.log('Deleting answer id:', answerToDelete);

    try {
      // Gọi API xóa câu trả lời
      await api.delete(`/api/answer/id/${answerToDelete}`);

      // Cập nhật UI - xóa câu trả lời khỏi danh sách
      if (selectedQuestion) {
        const updatedAnswers = selectedQuestion.answers.filter(ans => ans.id !== answerToDelete);
        setSelectedQuestion({
          ...selectedQuestion,
          answers: updatedAnswers,
          status: updatedAnswers.length > 0 ? 'Đã trả lời' : 'Chưa trả lời'
        });
      }

      // Cập nhật danh sách câu hỏi
      const updatedQuestions = Array.isArray(questions) ? questions.map(q => {
        if (q.id === selectedQuestion?.id) {
          const updatedAnswers = q.answers.filter(ans => ans.id !== answerToDelete);
          return {
            ...q,
            answers: updatedAnswers,
            status: updatedAnswers.length > 0 ? 'Đã trả lời' : 'Chưa trả lời'
          };
        }
        return q;
      }) : [];

      if (externalQuestions) {
        // Nếu questions được truyền từ bên ngoài, gọi lại hàm fetch
        if (fetchQuestions) fetchQuestions();
      } else {
        setInternalQuestions(updatedQuestions);
      }

      showToast('Câu trả lời đã được xóa thành công!', 'success');
    } catch (error) {
      console.error('Failed to delete answer:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Không thể xóa câu trả lời. Vui lòng thử lại sau!';
      showToast(errorMessage, 'error');
    } finally {
      setShowDeleteModal(false);
      setAnswerToDelete(null);
    }
  };

  // Lọc câu hỏi dựa trên search và filter
  const filteredQuestions = Array.isArray(questions) ? questions.filter(question => {
    if (!question) return false;
    return (
      (question.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (question.content || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) : [];

  return (
    <div className="min-h-[80vh] bg-gray-50 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Câu hỏi từ khách hàng</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={fetchQuestions || fetchQuestionsFromAPI}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-start">
          <AlertCircle className="mr-2 mt-0.5" size={16} />
          <p>{error}</p>
        </div>
      ) : selectedQuestion ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="mb-2">
              <button
                onClick={() => setSelectedQuestion(null)}
                className="text-blue-600 hover:text-blue-800 flex items-center font-medium mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Quay lại danh sách
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              {selectedQuestion.title}
              {selectedQuestion.edited && (
                <span className="ml-2 text-xs text-gray-500 font-normal">(đã chỉnh sửa)</span>
              )}
            </h2>

            <div className="flex items-center text-gray-500 text-sm mb-4">
              <div className="flex items-center mr-4">
                <User className="h-4 w-4 mr-1" />
                <span>{selectedQuestion.userName}</span>
              </div>
              <div className="flex items-center mr-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(selectedQuestion.date)}</span>
              </div>
              <div className="flex items-center mr-4">
                <Eye className="h-4 w-4 mr-1" />
                <span>{selectedQuestion.views || 0} lượt xem</span>
              </div>
            </div>

            {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedQuestion.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="text-gray-800 mb-6 whitespace-pre-line">
              {(selectedQuestion.content || selectedQuestion.question)?.replace(/\(edited\)/gi, '').trim()}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {selectedQuestion.answers?.length || 0} Câu trả lời
              </h3>

              {selectedQuestion.answers?.length > 0 ? (
                <div className="space-y-6">
                  {selectedQuestion.answers.map(answer => (
                    <div key={answer.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start">
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <h4 className="font-semibold text-blue-700">{answer.doctorName}</h4>
                              <svg className="w-4 h-4 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>

                            {/* Hiển thị nút xóa nếu câu trả lời này là của bác sĩ hiện tại */}
                            {user && (user.id === answer.doctorId || user.role === 'admin') && (
                              <button
                                onClick={() => handleAskDeleteAnswer(answer.id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                title="Xóa câu trả lời"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-3">{formatDate(answer.date)}</p>

                          <div className="text-gray-800 mb-3 whitespace-pre-line">
                            {answer.content}
                          </div>

                          <button
                            onClick={() => handleLikeAnswer(selectedQuestion.id, answer.id)}
                            className="flex items-center text-gray-500 hover:text-blue-600 text-sm"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{answer.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              ) : (
                <p className="text-gray-500 italic text-center py-6">
                  Chưa có câu trả lời nào. Hãy là người đầu tiên trả lời!
                </p>
              )}

              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-3">Trả lời câu hỏi này</h4>
                <div>
                  <textarea
                    name="answer"
                    placeholder="Nhập câu trả lời của bạn..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                  ></textarea>
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={() => setSelectedQuestion(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      disabled={submitting}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSubmitAnswer}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Đang gửi...
                        </>
                      ) : (
                        'Đăng câu trả lời'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách câu hỏi</h2>
            {filteredQuestions.length > 0 ? (
              <>
                {/* Header information - CỐ ĐỊNH */}
                <div className="mb-4 text-sm text-gray-600">
                  Tìm thấy {filteredQuestions.length} câu hỏi
                </div>

                {/* Questions list - CHỈ PHẦN NÀY CÓ SCROLL */}
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {filteredQuestions.map(question => (
                    <div
                      key={question.id}
                      className="border border-gray-100 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedQuestion(question)}
                          className="text-lg font-medium text-blue-700 hover:text-blue-800 text-left flex items-center"
                        >
                          {question.title}
                          {question.edited && (
                            <span className="ml-2 text-xs text-gray-500 font-normal">(đã chỉnh sửa)</span>
                          )}
                        </button>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-gray-500">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span className="text-sm">{question.answers?.length || 0}</span>
                          </div>

                          <div className="flex items-center text-gray-500">
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="text-sm">{question.views || 0}</span>
                          </div>

                          {getStatusBadge(question.status)}
                        </div>
                      </div>

                      <p className="text-gray-600 line-clamp-2 mb-3">
                        {(question.content || question.question)?.replace(/\(edited\)/gi, '').trim()}
                      </p>

                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {question.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                          <User className="h-3 w-3 mr-1" />
                          <span className="mr-3">{question.userName}</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(question.date)}</span>
                        </div>

                        <button
                          onClick={() => setSelectedQuestion(question)}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 flex items-center gap-2 text-sm"
                        >
                          <Reply size={14} />
                          Trả lời
                        </button>
                      </div>

                      {/* Hiển thị câu trả lời ngay dưới câu hỏi */}
                      {question.answers && question.answers.length > 0 && (
                        <div className="mt-3">
                          {!expandedAnswers[question.id] ? (
                            <button
                              onClick={() => toggleAnswerVisibility(question.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              {question.answers.length > 1 ?
                                `Xem ${question.answers.length} câu trả lời của bác sĩ` :
                                'Xem câu trả lời của bác sĩ'}
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleAnswerVisibility(question.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mb-3"
                              >
                                Ẩn câu trả lời
                                <ChevronUp className="h-4 w-4 ml-1" />
                              </button>

                              <div className="space-y-3 pl-4 border-l-2 border-blue-100">
                                {question.answers.map(answer => (
                                  <div key={answer.id} className="bg-blue-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                      <div className="font-medium text-blue-800 text-sm">{answer.doctorName}</div>
                                      <div className="text-xs text-gray-500">{formatDate(answer.date)}</div>
                                    </div>
                                    <p className="text-gray-700 text-sm mb-1">{answer.content}</p>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="font-medium">Không tìm thấy câu hỏi nào.</p>
                <p className="mt-1">Hiện tại không có câu hỏi nào cần được trả lời.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa câu trả lời */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">
              Xác nhận xóa câu trả lời
            </h3>

            <div className="mb-6">
              <p className="text-gray-600 text-center leading-relaxed">
                Bạn có chắc chắn muốn xóa câu trả lời này không?
              </p>
              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 text-center">
                  ⚠️ Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn câu trả lời.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setAnswerToDelete(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                🚫 Hủy bỏ
              </button>
              <button
                onClick={handleDeleteAnswer}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105"
              >
                🗑️ Xóa câu trả lời
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}