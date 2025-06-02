import React, { useEffect } from 'react'
import { useState } from 'react';
import Header from '../Header/Header';
import { useAuth } from '../Auth/AuthContext';
import { User, Camera, UserCheck, Edit3, Mail, Phone, Lock, X, Save } from 'lucide-react';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        fullName: user?.fullName || 'Nguyễn Văn A',
        email: user?.email || 'nguyenvana@example.com',
        phone: user?.phone || '0912345678',
        dateOfBirth: '1990-01-01',
        address: 'TP. Hồ Chí Minh',
        gender: 'male',
        avatar: null,
    });

// Add this useEffect to handle redirection
    useEffect(() => {
        if (!user) {
            navigate('/'); // Redirect to home page or login page
        } else {
            // If user is logged in, update formData if it hasn't been set yet
            // or if user details change (e.g., after an update elsewhere)
            setFormData({
                fullName: user.fullName || 'Nguyễn Văn A',
                email: user.email || 'nguyenvana@example.com',
                phone: user.phone || '0912345678',
                dateOfBirth: user.dateOfBirth || '1990-01-01', // Assuming user object might have these
                address: user.address || 'TP. Hồ Chí Minh',
                gender: user.gender || 'male',
                avatar: user.avatar || null,
            });
            setOriginalData({
                fullName: user.fullName || 'Nguyễn Văn A',
                email: user.email || 'nguyenvana@example.com',
                phone: user.phone || '0912345678',
                dateOfBirth: user.dateOfBirth || '1990-01-01',
                address: user.address || 'TP. Hồ Chí Minh',
                gender: user.gender || 'male',
                avatar: user.avatar || null,
            });
        }
    }, [user, navigate]);

    const [originalData, setOriginalData] = useState(formData);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Ở đây bạn sẽ gọi API để cập nhật thông tin
        console.log('Saving user data:', formData);
        setOriginalData(formData);
        setIsEditing(false);
        // Hiển thị thông báo thành công
        alert('Cập nhật thông tin thành công!');
    };


    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
    };


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    avatar: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Mật khẩu mới không khớp!');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            alert('Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }
        // Gọi API cập nhật mật khẩu
        console.log('Updating password');
        alert('Cập nhật mật khẩu thành công!');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };


    return (

        <div className='min-h-screen bg-gray-50 pt-24 mt-10'>
            <Header />
            <div className='pt-32 pb-16'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {/* Header Section */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12">
                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-white p-1">
                                        {formData.avatar ? (
                                            <img
                                                src={formData.avatar}
                                                alt="Avatar"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                                <User size={32} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                                            <Camera size={16} className="text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl font-bold text-white mb-2">
                                        {formData.fullName}
                                    </h1>
                                    <p className="text-purple-100 mb-1">{formData.email}</p>
                                    <div className="flex items-center justify-center sm:justify-start text-purple-100">
                                        <UserCheck size={16} className="mr-2" />
                                        <span>Thành viên đã xác thực</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-xl shadow-sm mb-8">
                        <div className="border-b border-gray-200">
                            <nav className="flex">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Thông tin cá nhân
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Bảo mật
                                </button>
                            </nav>
                        </div>

                        {/* Profile Tab Content */}
                        {activeTab === 'profile' && (
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Thông tin cá nhân
                                    </h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Edit3 size={16} />
                                            <span>Chỉnh sửa</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                <X size={16} />
                                                <span>Hủy</span>
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Save size={16} />
                                                <span>Lưu</span>
                                            </button>
                                        </div>

                                    )}

                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Họ và tên */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-3 py-2 border rounded-lg ${isEditing
                                                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-3 py-2 border rounded-lg ${isEditing
                                                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Số điện thoại */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại
                                        </label>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className={`w-full pl-10 pr-3 py-2 border rounded-lg ${isEditing
                                                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                                    : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>


                            </div>
                        )}

                        {/* Security Tab Content */}
                        {activeTab === 'security' && (
                            <div className="p-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-8">
                                    Đổi mật khẩu
                                </h2>

                                <form onSubmit={handlePasswordUpdate} className="max-w-md">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mật khẩu hiện tại
                                            </label>
                                            <div className="relative">
                                                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Mật khẩu phải có ít nhất 8 ký tự
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Cập nhật mật khẩu
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}


                    </div>




                </div>
            </div>
            <Footer />
        </div>
    )
}
