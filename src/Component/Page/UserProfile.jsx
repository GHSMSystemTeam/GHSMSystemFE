import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import Header from '../Header/Header';
import { useAuth } from '../Auth/AuthContext';
import { User, Camera, UserCheck, Edit3, Mail, Phone, Lock, X, Save, CalendarDays, Users } from 'lucide-react';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast/ToastProvider';
import api from '../config/axios';
export default function UserProfile() {
    const { user, login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const didFetch = useRef(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 0,
        avatar: null,
    });
    const [originalData, setOriginalData] = useState(formData);
    // Add this useEffect to handle redirection
    useEffect(() => {
        if (!user) {
            navigate('/'); // Redirect to home page or login page
        } else if (!didFetch.current) {
            didFetch.current = true;
            // Lấy user mới nhất từ API
            api.get('/api/user').then(res => {
                const users = res.data || [];
                const found = users.find(u => u.email === user.email);
                if (found) {
                    const initialData = {
                        fullName: user.name || user.fullName || '',
                        email: found.email || '',
                        phone: found.phone || '',
                        dateOfBirth: found.birthDate ? found.birthDate.split('T')[0] : '',
                        gender: found.gender !== undefined ? found.gender : 0,
                        avatar: found.profilePicture || null,
                    };
                    setFormData(initialData);
                    setOriginalData(initialData);
                    // Cập nhật lại context nếu muốn đồng bộ luôn
                    login({ ...user, ...found });
                }
            }).catch(() => {
                // fallback nếu lỗi API
                const initialData = {
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    dateOfBirth: user.birthDate ? user.birthDate.split('T')[0] : '',
                    gender: user.gender !== undefined ? user.gender : 0,
                    avatar: user.profilePicture && user.profilePicture.length > 0 ? user.profilePicture[0] : null,
                };
                setFormData(initialData);
                setOriginalData(initialData);
            });
        }
    }, [user, navigate, login]);


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

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Chỉ gửi các trường cần update
            const payload = {};
            if (formData.name !== user.name) payload.name = formData.name.trim();
            if (formData.phone !== user.phone) payload.phone = formData.phone.trim();
            if (formData.gender !== user.gender) payload.gender = Number(formData.gender);
            if (formData.dateOfBirth && formData.dateOfBirth !== (user.birthDate ? user.birthDate.split('T')[0] : "")) {
                payload.birthDate = new Date(formData.dateOfBirth).toISOString();
            }
            if (formData.avatar && formData.avatar !== (user.profilePicture && user.profilePicture[0])) {
                payload.profilePicture = formData.avatar;
            }

            // Nếu không có trường nào thay đổi thì không gọi API
            if (Object.keys(payload).length === 0) {
                setIsEditing(false);
                setIsLoading(false);
                showToast('Không có thay đổi nào để lưu.', 'info');
                return;
            }

            await api.put(`/api/user/${user.email}`, payload);

            // Cập nhật lại context và localStorage
            const updatedUserData = {
                ...user,
                ...payload,
                name: payload.name || user.name,
                phone: payload.phone || user.phone,
                birthDate: payload.birthDate || user.birthDate,
                gender: payload.gender !== undefined ? payload.gender : user.gender,
                profilePicture: payload.profilePicture
                    ? [payload.profilePicture]
                    : user.profilePicture,
            };

            localStorage.setItem('user', JSON.stringify(updatedUserData));
            login(updatedUserData);

            setOriginalData(formData);
            setIsEditing(false);
            showToast('Cập nhật thông tin thành công!', 'success');
        } catch (error) {
            console.error("Error updating profile:", error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin!';
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
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
        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                alert('Mật khẩu mới không khớp!');
                return;
            }
            if (passwordData.newPassword.length < 8) {
                alert('Mật khẩu phải có ít nhất 8 ký tự!');
                return;
            }
            // Lấy danh sách users từ localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');

            // Tìm user hiện tại và kiểm tra mật khẩu
            const currentUser = users.find(u => u.email === user.email);
            if (!currentUser || currentUser.password !== passwordData.currentPassword) {
                showToast('Mật khẩu hiện tại không đúng!', 'error');
                return;
            }

            // Cập nhật mật khẩu mới
            const updatedUsers = users.map(u => {
                if (u.email === user.email) {
                    return {
                        ...u,
                        password: passwordData.newPassword
                    };
                }
                return u;
            });
            // Lưu lại vào localStorage
            localStorage.setItem('users', JSON.stringify(updatedUsers));

            // Reset form và hiển thị thông báo
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            showToast('Cập nhật mật khẩu thành công!', 'success');
        } catch (error) {
            showToast('Có lỗi xảy ra khi cập nhật mật khẩu!', 'error');
        }

    };
    const getGenderDisplay = (genderValue) => {
        switch (parseInt(genderValue)) {
            case 0: return 'Nam';
            case 2: return 'Nữ';
            case 1: return 'Khác';
            default: return 'Không xác định';
        }
    };

    if (!user) {
        return null;
    }

    return (

        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 pt-24">
            <Header />
            <div className="pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 border border-blue-100">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12 relative">
                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-full bg-white p-1 shadow-lg border-4 border-blue-200 transition-all duration-300 group-hover:scale-105">
                                        {formData.avatar ? (
                                            <img
                                                src={formData.avatar}
                                                alt="Avatar"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                                <User size={40} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-2 right-2 w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-lg transition-colors group-hover:scale-110">
                                            <Camera size={18} className="text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    {!isEditing && (
                                        <div className="absolute bottom-2 right-2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                                            <Camera size={18} className="text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                                        {formData.name}
                                    </h1>
                                    <p className="text-purple-100 mb-1">{formData.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-2xl shadow-lg mb-10 border border-blue-100">
                        <div className="border-b border-gray-200">
                            <nav className="flex">
                                <button onClick={() => setActiveTab('profile')} className={`px-8 py-4 text-base font-semibold border-b-2 transition-colors duration-200 ${activeTab === 'profile' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}>
                                    <User className="inline mr-2 mb-1" size={18} />
                                    Thông tin cá nhân
                                </button>
                                <button onClick={() => setActiveTab('security')} className={`px-8 py-4 text-base font-semibold border-b-2 transition-colors duration-200 ${activeTab === 'security' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}>
                                    <Lock className="inline mr-2 mb-1" size={18} />
                                    Bảo mật
                                </button>
                            </nav>
                        </div>

                        {/* Profile Tab Content */}
                        {activeTab === 'profile' && (
                            <div className="p-10 animate-fade-in">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                        <User className="mr-2" size={20} />
                                        Thông tin cá nhân
                                    </h2>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition-colors" disabled={isLoading}>
                                            <Edit3 size={18} />
                                            <span>Chỉnh sửa</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-3">
                                            <button onClick={handleCancel} className="flex items-center space-x-2 px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow transition-colors" disabled={isLoading}>
                                                <X size={18} />
                                                <span>Hủy</span>
                                            </button>
                                            <button onClick={handleSave} className="flex items-center space-x-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow transition-colors disabled:opacity-50" disabled={isLoading}>
                                                {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                                                <span>{isLoading ? 'Đang lưu...' : 'Lưu'}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Họ và tên */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><User size={16} className="mr-2" />Họ và tên</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={!isEditing} className={`w-full pl-3 pr-3 py-2 border rounded-lg transition-all ${isEditing ? 'border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white' : 'border-gray-200 bg-gray-50 text-gray-700'}`} />
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Mail size={16} className="mr-2" />Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className="w-full pl-3 pr-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-700" />
                                    </div>
                                    {/* Số điện thoại */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Phone size={16} className="mr-2" />Số điện thoại</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} className={`w-full pl-3 pr-3 py-2 border rounded-lg transition-all ${isEditing ? 'border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white' : 'border-gray-200 bg-gray-50 text-gray-700'}`} />
                                    </div>
                                    {/* Ngày sinh */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><CalendarDays size={16} className="mr-2" />Ngày sinh</label>
                                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} disabled={!isEditing} className={`w-full pl-3 pr-3 py-2 border rounded-lg transition-all ${isEditing ? 'border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white' : 'border-gray-200 bg-gray-50 text-gray-700'}`} />
                                    </div>
                                    {/* Giới tính */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Users size={16} className="mr-2" />Giới tính</label>
                                        {isEditing ? (
                                            <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full pl-3 pr-3 py-2 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
                                                <option value={0}>Nam</option>
                                                <option value={2}>Nữ</option>
                                                <option value={1}>Khác</option>
                                            </select>
                                        ) : (
                                            <input type="text" value={getGenderDisplay(formData.gender)} disabled className="w-full pl-3 pr-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-700" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab Content */}
                        {activeTab === 'security' && (
                            <div className="p-10 animate-fade-in">
                                <h2 className="text-xl font-semibold text-gray-800 mb-8 flex items-center">
                                    <Lock className="mr-2" size={20} />
                                    Đổi mật khẩu
                                </h2>
                                <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-7">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Lock size={16} className="mr-2" />
                                            Mật khẩu hiện tại
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Lock size={16} className="mr-2" />
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="••••••••"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Mật khẩu phải có ít nhất 8 ký tự
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Lock size={16} className="mr-2" />
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow"
                                    >
                                        Cập nhật mật khẩu
                                    </button>
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
