import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import {
    Send,
    MessageCircle,
    User,
    Bot,
    Clock,
    Phone,
    Video,
    Calendar,
    Star,
    Shield,
    CheckCircle,
    ArrowLeft,
    UserCheck,
    Stethoscope,
    Heart,
    Users,
    ChevronDown,
    ChevronUp,
    HelpCircle,
    Search,
    Plus,
    MessageSquare,
    Filter,
    ThumbsUp,
    Eye,
    Tag
} from 'lucide-react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useAuthCheck } from '../Auth/UseAuthCheck';
import { useToast } from '../Toast/ToastProvider';
import api from '../config/axios';

export default function Consulation() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { checkAuthAndShowPrompt } = useAuthCheck();
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        title: '',
        content: '',
        tags: []
    });
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [currentTag, setCurrentTag] = useState('');
    const [filterTag, setFilterTag] = useState('');
    const [expandedAnswers, setExpandedAnswers] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const handleAskDeleteQuestion = (questionId) => {
        setQuestionToDelete(questionId);
        setShowDeleteModal(true);
    };
    const [showEditQuestionForm, setShowEditQuestionForm] = useState(false);
    const [editQuestion, setEditQuestion] = useState({
        id: '',
        title: '',
        content: '',
        tags: []
    });


    const tags = ["Sức khỏe sinh sản", "Nam khoa", "Phụ khoa", "Bệnh lây truyền", "Sức khỏe tình dục", "Tâm lý"];

    // Tải dữ liệu câu hỏi từ localStorage khi component được mount
    useEffect(() => {
        // Lấy dữ liệu từ localStorage
        const storedQuestions = JSON.parse(localStorage.getItem('healthQuestions') || '[]');
        setQuestions(storedQuestions);
    }, []);

    // Khởi tạo dữ liệu mẫu nếu không có sẵn
    useEffect(() => {
        // Fetch câu hỏi từ API
        const fetchQuestions = async () => {
            try {
                const response = await api.get('/api/question/active');
                let formattedQuestions = [];
                if (response.data && Array.isArray(response.data)) {
                    // Lấy dữ liệu edited từ localStorage (nếu có)
                    const storedQuestions = JSON.parse(localStorage.getItem('healthQuestions') || '[]');
                    formattedQuestions = response.data.map(q => {
                        const local = storedQuestions.find(lq => lq.id === q.id);
                        return {
                            id: q.id,
                            userId: q.customer?.id || q.customerId,
                            userName: q.customer?.name || "Người dùng ẩn danh",
                            title: q.title,
                            content: q.content,
                            date: q.createDate,
                            tags: q.tags || [],
                            views: q.views || 0,
                            likes: q.likes || 0,
                            answers: q.answers?.map(a => ({
                                id: a.id,
                                doctorId: a.user?.id,
                                doctorName: a.user?.name || "Bác sĩ",
                                content: a.answerContent,
                                date: a.createDate,
                                likes: a.rating || 0
                            })) || [],
                            edited: local?.edited || false // Giữ lại trạng thái edited nếu có
                        };
                    });
                    setQuestions(formattedQuestions);
                    localStorage.setItem('healthQuestions', JSON.stringify(formattedQuestions));
                } else {
                    const storedQuestions = JSON.parse(localStorage.getItem('healthQuestions') || '[]');
                    setQuestions(storedQuestions);
                }
            } catch (error) {
                console.error("Failed to fetch questions:", error);

                // Hiển thị thông báo lỗi cụ thể hơn
                if (error.response) {
                    console.error("Error response:", error.response.data);
                    console.error("Error status:", error.response.status);
                }

                // Fallback vào localStorage nếu API gặp lỗi
                const storedQuestions = JSON.parse(localStorage.getItem('healthQuestions') || '[]');
                setQuestions(storedQuestions);

                // Khởi tạo dữ liệu mẫu nếu không có sẵn
                if (!localStorage.getItem('healthQuestions')) {
                    localStorage.setItem('healthQuestions', JSON.stringify(sampleQuestions));
                    setQuestions(sampleQuestions);
                }
            }
        };

        fetchQuestions();
    }, []);

    const handleShowEditForm = (question) => {
        setEditQuestion({
            id: question.id,
            title: question.title,
            content: question.content,
            tags: question.tags || []
        });
        setShowEditQuestionForm(true);
    };

    const handleUpdateQuestion = async (e) => {
        e.preventDefault();

        if (!editQuestion.title.trim() || !editQuestion.content.trim()) {
            showToast('Vui lòng điền đầy đủ tiêu đề và nội dung câu hỏi', 'error');
            return;
        }

        try {
            // Tạo payload theo format API yêu cầu
            const questionPayload = {
                customerId: user.id,
                title: editQuestion.title,
                content: editQuestion.content,
                createDate: new Date().toISOString(),
                isPublic: true
            };

            // Gọi API PUT để cập nhật câu hỏi
            const response = await api.put(`/api/question/id/${editQuestion.id}`, questionPayload);

            // Cập nhật state và localStorage
            const updatedQuestions = questions.map(q => {
                if (q.id === editQuestion.id) {
                    return {
                        ...q,
                        title: editQuestion.title,
                        content: editQuestion.content,
                        tags: editQuestion.tags,
                        edited: true
                    };
                }
                return q;
            });

            setQuestions(updatedQuestions);
            localStorage.setItem('healthQuestions', JSON.stringify(updatedQuestions));

            // Nếu đang xem chi tiết câu hỏi này, cập nhật lại
            if (selectedQuestion && selectedQuestion.id === editQuestion.id) {
                setSelectedQuestion({
                    ...selectedQuestion,
                    title: editQuestion.title,
                    content: editQuestion.content,
                    tags: editQuestion.tags,
                    edited: true
                });
            }

            setShowEditQuestionForm(false);
            showToast('Cập nhật câu hỏi thành công!', 'success');
        } catch (error) {
            console.error('Failed to update question:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Không thể cập nhật câu hỏi. Vui lòng thử lại sau!';
            showToast(errorMessage, 'error');
        }
    };

    const handleNewQuestionSubmit = async (e) => {
        e.preventDefault();

        if (!checkAuthAndShowPrompt('đăng câu hỏi')) {
            showToast('Vui lòng đăng nhập để đăng câu hỏi', 'info');
            return;
        }

        if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
            showToast('Vui lòng điền đầy đủ tiêu đề và nội dung câu hỏi', 'error');
            return;
        }

        try {
            // Tạo payload theo format API yêu cầu
            const questionPayload = {
                customerId: user.id,
                title: newQuestion.title,
                content: newQuestion.content,
                createDate: new Date().toISOString(),
                isPublic: true // Mặc định là công khai
            };

            console.log("Payload gửi đi:", questionPayload);

            // Gọi API để tạo câu hỏi mới
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await api.post('/api/question', questionPayload, config);
            console.log('Question created:', response.data);

            // Tạo đối tượng câu hỏi mới để hiển thị trên UI
            const newQuestionObj = {
                id: response.data.id || Date.now(), // Sử dụng ID từ server nếu có
                userId: user.id,
                userName: user.fullName || user.name,
                title: newQuestion.title,
                content: newQuestion.content,
                date: questionPayload.createDate,
                tags: newQuestion.tags,
                views: 0,
                likes: 0,
                answers: []
            };

            // Cập nhật state và localStorage
            const updatedQuestions = [...questions, newQuestionObj];
            setQuestions(updatedQuestions);
            localStorage.setItem('healthQuestions', JSON.stringify(updatedQuestions));

            // Reset form và hiển thị thông báo
            setNewQuestion({ title: '', content: '', tags: [] });
            setShowNewQuestionForm(false);
            showToast('Câu hỏi của bạn đã được đăng thành công!', 'success');
        } catch (error) {
            console.error('Failed to create question:', error);
            console.error('Error details:', error.response);

            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Không thể đăng câu hỏi. Vui lòng thử lại sau!';
            showToast(errorMessage, 'error');
        }
    };

    const handleDeleteQuestion = async () => {
        if (!questionToDelete) return;
        try {
            await api.delete(`/api/question/${questionToDelete}`);
            const updatedQuestions = questions.filter(q => q.id !== questionToDelete);
            setQuestions(updatedQuestions);
            localStorage.setItem('healthQuestions', JSON.stringify(updatedQuestions));
            showToast('Đã xóa câu hỏi thành công!', 'success');
        } catch (error) {
            console.error('Failed to delete question:', error);
            showToast('Không thể xóa câu hỏi. Vui lòng thử lại!', 'error');
        } finally {
            setShowDeleteModal(false);
            setQuestionToDelete(null);
        }
    };

    const addTag = () => {
        if (currentTag && !newQuestion.tags.includes(currentTag)) {
            setNewQuestion({ ...newQuestion, tags: [...newQuestion.tags, currentTag] });
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setNewQuestion({
            ...newQuestion,
            tags: newQuestion.tags.filter(tag => tag !== tagToRemove)
        });
    };

    const handleViewQuestion = (question) => {
        // Cập nhật số lượt xem
        const updatedQuestions = questions.map(q => {
            if (q.id === question.id) {
                return { ...q, views: q.views + 1 };
            }
            return q;
        });

        localStorage.setItem('healthQuestions', JSON.stringify(updatedQuestions));
        setQuestions(updatedQuestions);
        setSelectedQuestion(question);
    };

    const handleLikeQuestion = (questionId) => {
        if (!checkAuthAndShowPrompt('thích câu hỏi')) {
            showToast('Vui lòng đăng nhập để thích câu hỏi', 'info');
            return;
        }

        const updatedQuestions = questions.map(q => {
            if (q.id === questionId) {
                return { ...q, likes: q.likes + 1 };
            }
            return q;
        });

        localStorage.setItem('healthQuestions', JSON.stringify(updatedQuestions));
        setQuestions(updatedQuestions);

        if (selectedQuestion && selectedQuestion.id === questionId) {
            setSelectedQuestion({ ...selectedQuestion, likes: selectedQuestion.likes + 1 });
        }

        showToast('Cảm ơn bạn đã thích câu hỏi này!', 'success');
    };

    const handleLikeAnswer = (questionId, answerId) => {
        if (!checkAuthAndShowPrompt('thích câu trả lời')) {
            showToast('Vui lòng đăng nhập để thích câu trả lời', 'info');
            return;
        }

        const updatedQuestions = questions.map(q => {
            if (q.id === questionId) {
                const updatedAnswers = q.answers.map(a => {
                    if (a.id === answerId) {
                        return { ...a, likes: a.likes + 1 };
                    }
                    return a;
                });
                return { ...q, answers: updatedAnswers };
            }
            return q;
        });

        localStorage.setItem('healthQuestions', JSON.stringify(updatedQuestions));
        setQuestions(updatedQuestions);

        if (selectedQuestion && selectedQuestion.id === questionId) {
            const updatedAnswers = selectedQuestion.answers.map(a => {
                if (a.id === answerId) {
                    return { ...a, likes: a.likes + 1 };
                }
                return a;
            });
            setSelectedQuestion({ ...selectedQuestion, answers: updatedAnswers });
        }

        showToast('Cảm ơn bạn đã thích câu trả lời này!', 'success');
    };

    const handleAnswerSubmit = (e, questionId) => {
        e.preventDefault();

        if (!checkAuthAndShowPrompt('trả lời câu hỏi')) {
            showToast('Vui lòng đăng nhập để trả lời câu hỏi', 'info');
            return;
        }

        const answerContent = e.target.elements.answer.value;

        if (!answerContent.trim()) {
            showToast('Vui lòng nhập nội dung câu trả lời', 'error');
            return;
        }

        // Giả sử đây là bác sĩ đang đăng nhập - trong thực tế cần kiểm tra vai trò
        const doctorId = 1; // Mặc định dùng BS đầu tiên trong danh sách
        const doctor = doctors.find(d => d.id === doctorId);

        const newAnswer = {
            id: Date.now(),
            doctorId: doctorId,
            doctorName: doctor.name,
            content: answerContent,
            date: new Date().toISOString(),
            likes: 0
        };

        const updatedQuestions = questions.map(q => {
            if (q.id === questionId) {
                return {
                    ...q,
                    answers: [...q.answers, newAnswer]
                };
            }
            return q;
        });

        localStorage.setItem('healthQuestions', JSON.stringify(updatedQuestions));
        setQuestions(updatedQuestions);

        if (selectedQuestion && selectedQuestion.id === questionId) {
            setSelectedQuestion({
                ...selectedQuestion,
                answers: [...selectedQuestion.answers, newAnswer]
            });
        }

        e.target.elements.answer.value = '';
        showToast('Câu trả lời của bạn đã được đăng thành công!', 'success');
    };

    const toggleFaq = (index) => {
        if (openFaq === index) {
            setOpenFaq(null);
        } else {
            setOpenFaq(index);
        }
    };

    const filteredQuestions = questions.filter(question => {
        const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            question.content.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTag = filterTag ? question.tags.includes(filterTag) : true;

        return matchesSearch && matchesTag;
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const toggleAnswerVisibility = (questionId) => {
        setExpandedAnswers(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-50 pt-24 mt-10">
            <Header />

            <main className="container  mx-auto px-4 py-8">
                <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Cộng đồng hỏi đáp sức khỏe</h1>
                    <p className="text-gray-600 mb-6">
                        Đặt câu hỏi và nhận tư vấn từ các bác sĩ uy tín về các vấn đề sức khỏe giới tính
                    </p>
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
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center"
                            onClick={() => {
                                if (!checkAuthAndShowPrompt('đặt câu hỏi')) {
                                    showToast('Vui lòng đăng nhập để đặt câu hỏi', 'info');
                                    return;
                                }
                                setShowNewQuestionForm(true);
                            }}
                        >
                            <Plus className="h-5 w-5 mr-1" />
                            Đặt câu hỏi
                        </button>
                    </div>



                    {selectedQuestion ? (
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
                                        <span>{selectedQuestion.views} lượt xem</span>
                                    </div>
                                </div>

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

                                <div className="text-gray-800 mb-6 whitespace-pre-line">
                                    {selectedQuestion.content.replace(/\(edited\)/gi, '').trim()}
                                </div>


                            </div>

                            <div className="border-t">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        {selectedQuestion.answers.length} Câu trả lời
                                    </h3>

                                    {selectedQuestion.answers.length > 0 ? (
                                        <div className="space-y-6">
                                            {selectedQuestion.answers.map(answer => {
                                                const doctor = doctors.find(d => d.id === answer.doctorId);

                                                return (
                                                    <div key={answer.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 mr-4">
                                                                <div className="relative">
                                                                    <img
                                                                        src={doctor?.avatar || "https://via.placeholder.com/64"}
                                                                        alt={answer.doctorName}
                                                                        className="w-12 h-12 rounded-full object-cover"
                                                                    />
                                                                    {doctor?.isOnline && (
                                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex-grow">
                                                                <div className="flex items-center mb-1">
                                                                    <h4 className="font-semibold text-blue-700">{answer.doctorName}</h4>
                                                                    <svg className="w-4 h-4 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>

                                                                <p className="text-xs text-gray-500 mb-2">
                                                                    {doctor?.position}, {doctor?.hospital}
                                                                </p>

                                                                <p className="text-sm text-gray-600 mb-3">{formatDate(answer.date)}</p>

                                                                <div className="text-gray-800 mb-3 whitespace-pre-line">
                                                                    {answer.content}
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic text-center py-6">
                                            Chưa có câu trả lời nào. Hãy là người đầu tiên trả lời!
                                        </p>
                                    )}

                                    {user && user.role === 'doctor' && (
                                        <div className="mt-6">
                                            <h4 className="font-medium text-gray-800 mb-3">Trả lời câu hỏi này</h4>
                                            <form onSubmit={(e) => handleAnswerSubmit(e, selectedQuestion.id)}>
                                                <textarea
                                                    name="answer"
                                                    placeholder="Nhập câu trả lời của bạn..."
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    rows="4"
                                                    required
                                                ></textarea>
                                                <button
                                                    type="submit"
                                                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                                                >
                                                    Đăng câu trả lời
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {showNewQuestionForm ? (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">Đặt câu hỏi mới</h2>
                                        <button
                                            onClick={() => setShowNewQuestionForm(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <form onSubmit={handleNewQuestionSubmit}>
                                        <div className="mb-4">
                                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                                Tiêu đề
                                            </label>
                                            <input
                                                type="text"
                                                id="title"
                                                placeholder="Nhập tiêu đề câu hỏi"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={newQuestion.title}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                                                Nội dung
                                            </label>
                                            <textarea
                                                id="content"
                                                placeholder="Mô tả chi tiết câu hỏi của bạn"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="6"
                                                value={newQuestion.content}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                                                required
                                            ></textarea>
                                        </div>


                                        <div className="flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowNewQuestionForm(false)}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Đăng câu hỏi
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : showEditQuestionForm ? (<div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa câu hỏi</h2>
                                    <button
                                        onClick={() => setShowEditQuestionForm(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateQuestion}>
                                    <div className="mb-4">
                                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tiêu đề
                                        </label>
                                        <input
                                            type="text"
                                            id="edit-title"
                                            placeholder="Nhập tiêu đề câu hỏi"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={editQuestion.title}
                                            onChange={(e) => setEditQuestion({ ...editQuestion, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nội dung
                                        </label>
                                        <textarea
                                            id="edit-content"
                                            placeholder="Mô tả chi tiết câu hỏi của bạn"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows="6"
                                            value={editQuestion.content}
                                            onChange={(e) => setEditQuestion({ ...editQuestion, content: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditQuestionForm(false)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Cập nhật
                                        </button>
                                    </div>
                                </form>
                            </div>
                            ) : (
                                <div>
                                    <div className="bg-white rounded-lg mb-8">
                                        <h2 className="text-xl font-bold text-gray-800 mb-4">Câu hỏi mới nhất</h2>

                                        {filteredQuestions.length > 0 ? (
                                            <div className="space-y-1">
                                                {filteredQuestions.map(question => (
                                                    <div
                                                        key={question.id}
                                                        className="border border-gray-100 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <button
                                                                onClick={() => handleViewQuestion(question)}
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
                                                                    <span className="text-sm">{question.answers.length}</span>
                                                                </div>

                                                                <div className="flex items-center text-gray-500">
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    <span className="text-sm">{question.views}</span>
                                                                </div>
                                                                {/* {(user && (user.id === question.userId || user.role === 'admin')) && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleShowEditForm(question)}
                                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-2"
                                                                            title="Sửa câu hỏi"
                                                                        >
                                                                            Sửa
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleAskDeleteQuestion(question.id)}
                                                                            className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
                                                                            title="Xóa câu hỏi"
                                                                        >
                                                                            Xóa
                                                                        </button>
                                                                    </>
                                                                )} */}

                                                            </div>
                                                        </div>

                                                        <p className="text-gray-600 line-clamp-2 mb-3">
                                                            {question.content.replace(/\(edited\)/gi, '').trim()}
                                                        </p>

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

                                                        <div className="mt-3 flex items-center justify-between">
                                                            <div className="flex items-center text-gray-500 text-sm">
                                                                <User className="h-3 w-3 mr-1" />
                                                                <span className="mr-3">{question.userName}</span>
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                <span>{formatDate(question.date)}</span>
                                                            </div>



                                                            {user && (user.id === question.userId || user.role === 'admin') && (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            handleShowEditForm(question);
                                                                            setSelectedQuestion(null);
                                                                        }}
                                                                        className="flex items-center text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                        <span className="font-medium">Chỉnh sửa</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            handleAskDeleteQuestion(question.id);
                                                                            setSelectedQuestion(null);
                                                                        }}
                                                                        className="flex items-center text-red-600 hover:text-red-800"
                                                                    >
                                                                        <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                        <span className="font-medium">Xóa</span>
                                                                    </button>
                                                                </div>
                                                            )}
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
                                                                            `Xem ${question.answers.length} câu trả lời từ bác sĩ` :
                                                                            'Xem câu trả lời từ bác sĩ'}
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

                                                                        <div className="space-y-4 pl-4 border-l-2 border-blue-100">
                                                                            {question.answers.map(answer => {
                                                                                const doctor = doctors.find(d => d.id === answer.doctorId);

                                                                                return (
                                                                                    <div key={answer.id} className="bg-blue-50 rounded-lg p-3">
                                                                                        <div className="flex items-center space-x-2 mb-2">
                                                                                            <div className="relative flex-shrink-0">
                                                                                                <img
                                                                                                    src={doctor?.avatar || "https://via.placeholder.com/64"}
                                                                                                    alt={answer.doctorName}
                                                                                                    className="w-8 h-8 rounded-full object-cover"
                                                                                                />
                                                                                                {doctor?.isOnline && (
                                                                                                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                                                                                                )}
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className="flex items-center">
                                                                                                    <h4 className="font-medium text-blue-800 text-sm">{answer.doctorName}</h4>
                                                                                                    <svg className="w-3 h-3 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                                    </svg>
                                                                                                </div>
                                                                                                <p className="text-xs text-gray-500">{formatDate(answer.date)}</p>
                                                                                            </div>
                                                                                        </div>

                                                                                        <p className="text-gray-700 text-sm mb-2">{answer.content}</p>


                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">Không tìm thấy câu hỏi nào.</p>
                                                <button
                                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center mx-auto"
                                                    onClick={() => {
                                                        if (!checkAuthAndShowPrompt('đặt câu hỏi')) {
                                                            showToast('Vui lòng đăng nhập để đặt câu hỏi', 'info');
                                                            return;
                                                        }
                                                        setShowNewQuestionForm(true);
                                                    }}
                                                >
                                                    <Plus className="h-5 w-5 mr-1" />
                                                    Đặt câu hỏi
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>



                {/* FAQ Section */}
                <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp</h2>

                    <div className="space-y-2">
                        {/* FAQ items */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left focus:outline-none flex items-center justify-between bg-gray-50"
                                onClick={() => toggleFaq(0)}
                            >
                                <div className="flex items-center">
                                    <HelpCircle className="text-blue-600 mr-3 flex-shrink-0" size={20} />
                                    <span className="font-medium text-gray-800">Làm thế nào để đặt lịch khám?</span>
                                </div>
                                {openFaq === 0 ? (
                                    <ChevronUp className="text-gray-500" size={20} />
                                ) : (
                                    <ChevronDown className="text-gray-500" size={20} />
                                )}
                            </button>
                            {openFaq === 0 && (
                                <div className="px-6 py-4 text-gray-600">
                                    <p>
                                        Bạn có thể đặt lịch khám qua nhiều cách:
                                    </p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>Trực tuyến qua trang "Đặt lịch khám" trên website</li>
                                        <li>Gọi điện thoại đến hotline 1900-xxxx</li>
                                        <li>Đến trực tiếp quầy lễ tân tại trung tâm</li>
                                    </ul>
                                    <p className="mt-2">
                                        Sau khi đặt lịch, hệ thống sẽ tự động xác nhận và gửi thông báo nhắc trước 24 giờ.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left focus:outline-none flex items-center justify-between bg-gray-50"
                                onClick={() => toggleFaq(1)}
                            >
                                <div className="flex items-center">
                                    <HelpCircle className="text-blue-600 mr-3 flex-shrink-0" size={20} />
                                    <span className="font-medium text-gray-800">Thông tin của tôi có được bảo mật không?</span>
                                </div>
                                {openFaq === 1 ? (
                                    <ChevronUp className="text-gray-500" size={20} />
                                ) : (
                                    <ChevronDown className="text-gray-500" size={20} />
                                )}
                            </button>
                            {openFaq === 1 && (
                                <div className="px-6 py-4 text-gray-600">
                                    <p>
                                        Chúng tôi cam kết bảo mật 100% thông tin của bệnh nhân. Mọi câu hỏi và tư vấn đều được mã hóa và tuân thủ các quy định về bảo mật thông tin y tế. Chỉ bạn và bác sĩ được phân công mới có thể xem thông tin chi tiết về vấn đề sức khỏe của bạn.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left focus:outline-none flex items-center justify-between bg-gray-50"
                                onClick={() => toggleFaq(2)}
                            >
                                <div className="flex items-center">
                                    <HelpCircle className="text-blue-600 mr-3 flex-shrink-0" size={20} />
                                    <span className="font-medium text-gray-800">Tôi có thể hỏi bác sĩ về bất kỳ vấn đề nào không?</span>
                                </div>
                                {openFaq === 2 ? (
                                    <ChevronUp className="text-gray-500" size={20} />
                                ) : (
                                    <ChevronDown className="text-gray-500" size={20} />
                                )}
                            </button>
                            {openFaq === 2 && (
                                <div className="px-6 py-4 text-gray-600">
                                    <p>
                                        Bạn có thể đặt câu hỏi về mọi vấn đề liên quan đến sức khỏe giới tính, tình dục và sinh sản. Đội ngũ bác sĩ của chúng tôi chuyên về các lĩnh vực như Nam khoa, Phụ khoa, Tâm lý tình dục, các bệnh lây truyền qua đường tình dục và sức khỏe sinh sản.
                                    </p>
                                    <p className="mt-2">
                                        Tuy nhiên, các câu trả lời trực tuyến chỉ mang tính chất tham khảo và không thay thế cho việc thăm khám trực tiếp tại cơ sở y tế.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
                        {/* Header với icon cảnh báo */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Tiêu đề */}
                        <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">
                            Xác nhận xóa câu hỏi
                        </h3>

                        {/* Nội dung */}
                        <div className="mb-6">
                            <p className="text-gray-600 text-center leading-relaxed">
                                Bạn có chắc chắn muốn xóa câu hỏi này không?
                            </p>
                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-sm text-red-700 text-center">
                                    ⚠️ Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn câu hỏi cùng tất cả câu trả lời.
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setQuestionToDelete(null);
                                }}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                🚫 Hủy bỏ
                            </button>
                            <button
                                onClick={handleDeleteQuestion}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105"
                            >
                                🗑️ Xóa câu hỏi
                            </button>
                        </div>

                        {/* Thông tin bổ sung */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                💡 Tip: Bạn có thể chỉnh sửa câu hỏi thay vì xóa hoàn toàn
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />


        </div>
    );
}
