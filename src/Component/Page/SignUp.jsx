import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LogoGHSMS from '../Logo/LogoGHSMS';
import api from '../config/axios';
import { toast } from 'react-toastify';

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: 0,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "gender" ? Number(value) : value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin');
            setIsLoading(false);
            return;
        }

        // Password match validation
        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Mật khẩu không khớp');
            setIsLoading(false);
            return;
        }

        try {
        // Map frontend fields to backend payload
        let apiGender;
        if (formData.gender === 0) { // Frontend Male
            apiGender = 1; // Backend Male
        } else if (formData.gender === 1) { // Frontend Female
            apiGender = 2; // Backend Female
        } else if (formData.gender === 2) { // Frontend Other
            apiGender = 3; // Backend Other
        } else {
            // Handle unexpected frontend gender value, perhaps default or throw error
            // For now, let's assume it won't happen if your select options are fixed
            apiGender = 1; // Default to Male or handle error appropriately
        }
        const payload = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            gender: formData.gender,
            phone: formData.phone
        };
        //formData dữ liệu người dùng nhập
        //Đẩy cái dữ liệu. này xuống cho BE xử lý
        console.log("Sending payload:", payload);
        const response = await api.post('/api/register', payload); // Or /api/user if that's the correct one
        console.log("Registration successful:", response);
        toast.success("Successfully created new account!");
        navigate("/login");
        toast.success("Successfully create new account!");
        navigate("/login");
        } catch (err) {
            console.error("Registration error:", err);
            if (err.response) {
                console.error("Backend error response data:", err.response.data);
                const errorMsg = err.response.data?.message || err.response.data?.error || JSON.stringify(err.response.data);
                toast.error(String(errorMsg));
                setErrorMessage(String(errorMsg));
            } else {
                toast.error("Đăng ký thất bại. Vui lòng thử lại sau.");
                setErrorMessage("Đăng ký thất bại. Vui lòng thử lại sau.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-100 to-blue-50">
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex justify-center mb-6">
                            <LogoGHSMS />
                        </div>
                        
                        <h2 className="text-center text-2xl font-bold text-purple-600 mb-6">
                            Đăng ký tài khoản
                        </h2>
                        
                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                <span className="block sm:inline">{errorMessage}</span>
                            </div>
                        )}
                        
                        <form className="space-y-4" onSubmit={handleRegister}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ và tên
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0912345678"
                                    />
                                </div>
                            </div>
                            {/* Gender input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giới tính
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={1}>Nam</option>
                                    <option value={2}>Nữ</option>
                                    <option value={3}>Khác</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-1 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                    {/*
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                    */}
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Mật khẩu phải có ít nhất 5 ký tự
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-1 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                    {/* 
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                    */}
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <input
                                    id="agree-terms"
                                    name="agree-terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                                    Tôi đồng ý với <a href="#" className="text-blue-600 hover:text-blue-500">điều khoản dịch vụ</a> và <a href="#" className="text-blue-600 hover:text-blue-500">chính sách bảo mật</a>
                                </label>
                            </div>
                            
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Đăng ký
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Hoặc đăng ký với
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <span className="text-sm text-gray-600">Đã có tài khoản? </span>
                            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}