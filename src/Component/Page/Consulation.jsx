import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
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
    Users
} from 'lucide-react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useAuthCheck } from '../Auth/UseAuthCheck';
import { useToast } from '../Toast/ToastProvider';


export default function Consulation() {
    const { showToast } = useToast()
    const { checkAuthAndShowPrompt } = useAuthCheck();

    const [selectedConsultant, setSelectedConsultant] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');
    const messagesEndRef = useRef(null);

    const consultants = [
        {
            id: 1,
            name: "BS. Nguyễn Thị Hương",
            specialty: "Chuyên khoa Sản phụ khoa",
            experience: "15 năm kinh nghiệm",
            rating: 4.9,
            reviews: 234,
            avatar: "👩‍⚕️",
            status: "online",
            description: "Chuyên gia về sức khỏe sinh sản nữ, tư vấn kế hoạch hóa gia đình",
            consultationFee: "200,000 VNĐ"
        },
        {
            id: 2,
            name: "BS. Trần Minh Khoa",
            specialty: "Chuyên khoa Nam khoa",
            experience: "12 năm kinh nghiệm",
            rating: 4.8,
            reviews: 189,
            avatar: "👨‍⚕️",
            status: "online",
            description: "Chuyên gia về sức khỏe nam giới, rối loạn chức năng tình dục",
            consultationFee: "250,000 VNĐ"
        },
        {
            id: 3,
            name: "BS. Lê Thị Mai",
            specialty: "Tâm lý học Lâm sàng",
            experience: "10 năm kinh nghiệm",
            rating: 4.9,
            reviews: 156,
            avatar: "👩‍💼",
            status: "busy",
            description: "Chuyên gia tâm lý tình dục, tư vấn hôn nhân và gia đình",
            consultationFee: "180,000 VNĐ"
        },
        {
            id: 4,
            name: "BS. Phạm Văn An",
            specialty: "Chuyên khoa Da liễu",
            experience: "8 năm kinh nghiệm",
            rating: 4.7,
            reviews: 98,
            avatar: "👨‍⚕️",
            status: "offline",
            description: "Chuyên gia về các bệnh lây truyền qua đường tình dục",
            consultationFee: "220,000 VNĐ"
        }
    ];

    const quickQuestions = [
        "Tư vấn về sức khỏe sinh sản",
        "Hỏi về các xét nghiệm cần thiết",
        "Tư vấn tâm lý tình dục",
        "Hỏi về các biện pháp tránh thai",
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!checkAuthAndShowPrompt('gửi tin nhắn')) {
            showToast('Vui lòng đăng nhập để sử dụng dịch vụ này', 'info');
            return
        }
        if (!newMessage.trim() || !selectedConsultant) return

        const userMessage = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        }

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsTyping(true);

        //Stimulate consultant response
        setTimeout(() => {
            const consultantMessage = {
                id: Date.now() + 1,
                text: getConsultantResponse(newMessage),
                sender: 'consultant',
                timestamp: new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            }
            setMessages(prev => [...prev, consultantMessage]);
            setIsTyping(false);
        }, 2000)
    }

    const getConsultantResponse = (message) => {
        const responses = [
            `Cảm ơn bạn đã chia sẻ. Dựa trên thông tin bạn cung cấp, tôi khuyên bạn nên ${Math.random() > 0.5 ? 'thực hiện một số xét nghiệm cơ bản' : 'đến khám trực tiếp để được tư vấn chi tiết hơn'}. Bạn có thể cho tôi biết thêm về triệu chứng cụ thể không?`,
            `Tôi hiểu mối quan tâm của bạn. Đây là một vấn đề khá phổ biến và hoàn toàn có thể điều trị. Tôi sẽ cần thêm một số thông tin để đưa ra lời khuyên phù hợp nhất.`,
            `Dựa trên kinh nghiệm ${selectedConsultant?.experience}, tôi có thể giúp bạn giải quyết vấn đề này. Trước tiên, hãy cùng tìm hiểu về tình trạng hiện tại của bạn.`,
            `Cảm ơn bạn đã tin tưởng chia sẻ. Vấn đề bạn đang gặp phải cần được quan tâm đúng mức. Tôi khuyên bạn nên đặt lịch hẹn để được thăm khám trực tiếp.`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleQuickQuestion = (question) => {
        setNewMessage(question)
    }

    const startConsultation = (consultant) => {
        if (!checkAuthAndShowPrompt('bắt đầu tư vấn')) return;
        setSelectedConsultant(consultant)
        setMessages([
            {
                id: 1,
                text: `Xin chào! Tôi là ${consultant.name}, ${consultant.specialty}. Rất vui được hỗ trợ bạn hôm nay. Bạn có thể chia sẻ với tôi vấn đề bạn đang quan tâm không?`,
                sender: 'consultant',
                timestamp: new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }
        ]);
    }

    if (selectedConsultant) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                        <button
                            onClick={() => setSelectedConsultant(null)}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft size={20} />
                            <span>Quay lại</span>
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">{selectedConsultant.avatar}</div>
                            <div>
                                <h3 className="font-semibold text-gray-800">{selectedConsultant.name}</h3>
                                <p className="text-sm text-gray-600">{selectedConsultant.specialty}</p>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${selectedConsultant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                        </div>

                        <div className="flex space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Phone size={20} />
                            </button>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Video size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-80px)]">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                    }`}>
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                                        {message.sender === 'user' ? <User size={16} /> : selectedConsultant.avatar}
                                    </div>
                                    <div className={`rounded-2xl px-4 py-2 ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border shadow-sm'
                                        }`}>
                                        <p className="text-sm">{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                            {message.timestamp}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex items-start space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                                        {selectedConsultant.avatar}
                                    </div>
                                    <div className="bg-white border rounded-2xl px-4 py-2 shadow-sm">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    <div className="px-4 py-2">
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickQuestion(question)}
                                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-colors"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-white border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-24 mt-10">
            <Header />
            {/* Features */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Bảo mật tuyệt đối</h3>
                        <p className="text-sm text-gray-600">Thông tin cá nhân được bảo vệ hoàn toàn</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Chuyên gia uy tín</h3>
                        <p className="text-sm text-gray-600">Đội ngũ bác sĩ có chứng chỉ hành nghề</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Hỗ trợ 24/7</h3>
                        <p className="text-sm text-gray-600">Luôn sẵn sàng hỗ trợ mọi lúc cần thiết</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-pink-600" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Tư vấn tận tâm</h3>
                        <p className="text-sm text-gray-600">Lắng nghe và hỗ trợ với sự thấu hiểu</p>
                    </div>
                </div>

                {/* Consultants List */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Đội ngũ chuyên gia
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {consultants.map((consultant) => (
                            <div key={consultant.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-start space-x-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                                            {consultant.avatar}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${consultant.status === 'online' ? 'bg-green-500' :
                                            consultant.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                                            }`}></div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{consultant.name}</h3>
                                                <p className="text-blue-600 font-medium">{consultant.specialty}</p>
                                                <p className="text-sm text-gray-600">{consultant.experience}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    <span className="text-sm font-medium">{consultant.rating}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">({consultant.reviews} đánh giá)</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-700 mt-2 mb-3">{consultant.description}</p>

                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold text-green-600">{consultant.consultationFee}</span>
                                            <button
                                                onClick={() => startConsultation(consultant)}
                                                disabled={consultant.status === 'offline'}
                                                className={`px-6 py-2 rounded-lg font-medium transition-colors ${consultant.status === 'offline'
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                            >
                                                {consultant.status === 'offline' ? 'Không trực tuyến' : 'Tư vấn ngay'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
