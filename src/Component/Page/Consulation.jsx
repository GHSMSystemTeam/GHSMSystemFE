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

    const tags = ["Sức khỏe sinh sản", "Nam khoa", "Phụ khoa", "Bệnh lây truyền", "Sức khỏe tình dục", "Tâm lý", "Tư vấn"];

    // Tải dữ liệu câu hỏi từ localStorage khi component được mount
    useEffect(() => {
        const storedQuestions = JSON.parse(localStorage.getItem('healthQuestions') || '[]');
        setQuestions(storedQuestions);
    }, []);

    // Mẫu bác sĩ
    const doctors = [
        {
            id: 1,
            name: "THS.BS Phạm Đỗ Anh Thư",
            avatar: "https://vinmec-prod.s3.amazonaws.com/images/20190522_080648_368680_bs-dung2.max-800x800.jpg",
            specialty: "Tim mạch",
            position: "Trưởng đơn vị Bệnh Van tim",
            hospital: "Bệnh viện Đa khoa Tâm Anh TP.HCM",
            isOnline: true
        },
        {
            id: 2,
            name: "BS. Trần Minh Khoa",
            avatar: "https://vinmec-prod.s3.amazonaws.com/images/20220217_172142_404935_BS.Quan.max-1800x1800.jpg",
            specialty: "Nam khoa",
            position: "Bác sĩ chuyên khoa Nam học",
            hospital: "Trung tâm Y học Giới tính TP.HCM",
            isOnline: false
        },
        {
            id: 3,
            name: "BS. Nguyễn Thu Hương",
            avatar: "https://vinmec-prod.s3.amazonaws.com/images/20180418_022811_043232_bs-hong-nhung.max-800x800.jpg",
            specialty: "Phụ khoa",
            position: "Trưởng khoa Phụ sản",
            hospital: "Bệnh viện Đa khoa Tâm Anh TP.HCM",
            isOnline: true
        }
    ];

    // Mẫu câu hỏi mặc định
    const sampleQuestions = [
        {
            id: 1,
            userId: "user1",
            userName: "Nguyễn Hữu Mỹ Hòa",
            title: "Thường xuyên chóng mặt, buồn nôn có liên quan đến bệnh tim mạch?",
            content: "Chào bác sĩ. Khoảng 1 năm nay tôi hay bị chóng mặt, buồn nôn. Khi đó, mạch đập thấy bình thường, không bị đau đầu. Hiện tượng hay xảy ra lúc chuyển từ thế tư thế từ ngồi sang nằm hoặc chuyển từ thế lật qua lật lại trong khi nằm. Các xét nghiệm điện tim, huyết áp đều đều bình thường. Cho tôi hỏi, tôi đang gặp vấn đề gì? Làm cách nào để cải thiện sức khỏe?",
            date: "2023-10-15T08:30:00",
            tags: ["Tim mạch", "Chóng mặt"],
            views: 145,
            likes: 12,
            answers: [
                {
                    id: 1,
                    doctorId: 1,
                    doctorName: "THS.BS Phạm Đỗ Anh Thư",
                    content: "Chào chị, Triệu chứng chóng mặt của chị có thể do nhiều nguyên nhân như chóng mặt tư thế kịch phát lành tính, viêm đầy thần kinh tiền đình, bệnh do mắt như cận thị, hạ huyết áp tư thế, thiếu năng tuần hoàn não, u não,... Tốt nhất chị nên đến bác sĩ chuyên khoa để được thăm khám toàn diện. Từ đó có chẩn đoán chính xác và điều trị thích hợp cho chị. Trân trọng.",
                    date: "2023-10-15T10:45:00",
                    likes: 8
                }
            ]
        },
        {
            id: 2,
            userId: "user2",
            userName: "Trần Văn Minh",
            title: "Gần đây tôi bị đau tức vùng bụng dưới, đi tiểu buốt",
            content: "Tôi 28 tuổi, nam giới. Gần đây tôi thấy đau tức vùng bụng dưới, đi tiểu buốt và có mùi hôi. Đôi khi có cả máu trong nước tiểu. Tôi có quan hệ tình dục không an toàn cách đây khoảng 2 tuần. Xin bác sĩ tư vấn giúp tôi.",
            date: "2023-10-18T14:20:00",
            tags: ["Nam khoa", "Tiết niệu"],
            views: 89,
            likes: 5,
            answers: [
                {
                    id: 2,
                    doctorId: 2,
                    doctorName: "BS. Trần Minh Khoa",
                    content: "Chào anh, các triệu chứng của anh có thể gợi ý đến tình trạng viêm đường tiết niệu hoặc các bệnh lây truyền qua đường tình dục. Tôi khuyên anh nên đi khám ngay để được xét nghiệm và điều trị kịp thời. Trong thời gian chờ đợi, anh nên uống nhiều nước, tránh các chất kích thích và không nên tự ý sử dụng kháng sinh. Hẹn gặp anh tại phòng khám.",
                    date: "2023-10-18T16:30:00",
                    likes: 7
                }
            ]
        },
        {
            id: 3,
            userId: "user3",
            userName: "Phạm Thị Hương",
            title: "Chu kỳ kinh nguyệt không đều và đau bụng dữ dội",
            content: "Tôi 32 tuổi và gần đây chu kỳ kinh nguyệt của tôi rất không đều, có khi cách nhau tới 2 tháng. Khi có kinh thì đau bụng dữ dội đến mức không thể đi làm được. Tôi đã dùng thuốc giảm đau nhưng không hiệu quả. Tôi nên làm gì bây giờ?",
            date: "2023-10-20T09:15:00",
            tags: ["Phụ khoa", "Kinh nguyệt"],
            views: 120,
            likes: 15,
            answers: [
                {
                    id: 3,
                    doctorId: 3,
                    doctorName: "BS. Nguyễn Thu Hương",
                    content: "Chào chị, tình trạng đau bụng kinh và chu kỳ không đều có thể liên quan đến nhiều bệnh lý phụ khoa như lạc nội mạc tử cung, u xơ tử cung, hội chứng buồng trứng đa nang... Chị nên đến khám phụ khoa càng sớm càng tốt để được siêu âm và các xét nghiệm cần thiết. Trong thời gian này, chị có thể dùng túi chườm ấm và các biện pháp không dùng thuốc để giảm đau. Mong chị sớm khỏe.",
                    date: "2023-10-20T11:30:00",
                    likes: 12
                }
            ]
        }
    ];

    // Khởi tạo dữ liệu mẫu nếu không có sẵn
    useEffect(() => {
        if (!localStorage.getItem('healthQuestions')) {
            localStorage.setItem('healthQuestions', JSON.stringify(sampleQuestions));
            setQuestions(sampleQuestions);
        }
    }, []);

    const handleNewQuestionSubmit = (e) => {
        e.preventDefault();

        if (!checkAuthAndShowPrompt('đăng câu hỏi')) {
            showToast('Vui lòng đăng nhập để đăng câu hỏi', 'info');
            return;
        }

        if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
            showToast('Vui lòng điền đầy đủ tiêu đề và nội dung câu hỏi', 'error');
            return;
        }

        const newQuestionObj = {
            id: Date.now(),
            userId: user.email,
            userName: user.fullName,
            title: newQuestion.title,
            content: newQuestion.content,
            date: new Date().toISOString(),
            tags: newQuestion.tags,
            views: 0,
            likes: 0,
            answers: []
        };

        const updatedQuestions = [...questions, newQuestionObj];
        setQuestions(updatedQuestions);
        localStorage.setItem('healthQuestions', JSON.stringify(updatedQuestions));

        setNewQuestion({ title: '', content: '', tags: [] });
        setShowNewQuestionForm(false);
        showToast('Câu hỏi của bạn đã được đăng thành công!', 'success');
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
        <div className="min-h-screen bg-gray-50 pt-24 mt-10">
            <Header />

            <main className="container mx-auto px-4 py-8">
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

                        <div className="flex-shrink-0">
                            <select
                                className="pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filterTag}
                                onChange={(e) => setFilterTag(e.target.value)}
                            >
                                <option value="">Tất cả chủ đề</option>
                                {tags.map((tag, index) => (
                                    <option key={index} value={tag}>{tag}</option>
                                ))}
                            </select>
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

                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedQuestion.title}</h2>

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
                                    {selectedQuestion.content}
                                </div>

                                <div className="flex items-center justify-between border-t pt-4">
                                    <button
                                        onClick={() => handleLikeQuestion(selectedQuestion.id)}
                                        className="flex items-center text-gray-600 hover:text-blue-600"
                                    >
                                        <ThumbsUp className="h-5 w-5 mr-1" />
                                        <span className="font-medium">{selectedQuestion.likes}</span>
                                    </button>
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

                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Chủ đề
                                            </label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {newQuestion.tags.map((tag, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center"
                                                    >
                                                        <span className="text-sm">{tag}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag(tag)}
                                                            className="ml-1 text-blue-500 hover:text-blue-700"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex">
                                                <select
                                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    value={currentTag}
                                                    onChange={(e) => setCurrentTag(e.target.value)}
                                                >
                                                    <option value="">Chọn chủ đề</option>
                                                    {tags.map((tag, index) => (
                                                        <option key={index} value={tag}>{tag}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={addTag}
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200"
                                                >
                                                    Thêm
                                                </button>
                                            </div>
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
                                                                className="text-lg font-medium text-blue-700 hover:text-blue-800 text-left"
                                                            >
                                                                {question.title}
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
                                                            </div>
                                                        </div>

                                                        <p className="text-gray-600 line-clamp-2 mb-3">
                                                            {question.content}
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

                                                            <button
                                                                onClick={() => handleLikeQuestion(question.id)}
                                                                className="flex items-center text-gray-500 hover:text-blue-600"
                                                            >
                                                                <ThumbsUp className="h-4 w-4 mr-1" />
                                                                <span>{question.likes}</span>
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

                                                                                        <div className="flex justify-end">
                                                                                            <button
                                                                                                onClick={() => handleLikeAnswer(question.id, answer.id)}
                                                                                                className="flex items-center text-gray-500 hover:text-blue-600 text-xs"
                                                                                            >
                                                                                                <ThumbsUp className="h-3 w-3 mr-1" />
                                                                                                <span>{answer.likes}</span>
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>

                                                                        <div className="mt-3 flex justify-end">
                                                                            <button
                                                                                onClick={() => handleViewQuestion(question)}
                                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                                                                            >
                                                                                Xem chi tiết câu hỏi
                                                                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                                </svg>
                                                                            </button>
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



                {/* CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 shadow-lg text-white text-center mb-8">
                    <h2 className="text-2xl font-bold mb-4">Đặt lịch khám trực tiếp ngay hôm nay</h2>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                        Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm của chúng tôi sẵn sàng tư vấn và điều trị mọi vấn đề sức khỏe giới tính của bạn với sự tận tâm và bảo mật tuyệt đối.
                    </p>
                    <Link
                        to="/appointment"
                        className="inline-block bg-white text-blue-700 font-medium px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        Đặt lịch ngay
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
