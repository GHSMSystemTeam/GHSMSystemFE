import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LogoGHSMS from '../Logo/LogoGHSMS';
import { useAuth } from '../Auth/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const { user } = useAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        // Basic validation
        if (!email || !password) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        try {
            // Only allow admin login
            const adminEmail = "admin@example.com";
            const adminPassword = "admin123"; // Set your admin password here

            if (email === adminEmail && password === adminPassword) {
                login({
                    fullName: "Admin User",
                    email: adminEmail,
                    role: "admin"
                });
                navigate("/admin-profile"); // Redirect to admin profile page
            } else {
                setErrorMessage('Chỉ tài khoản admin được phép đăng nhập');
            }
            // Giả lập API call để lấy thông tin user
            const userData = JSON.parse(localStorage.getItem('users') || '[]')
                .find(user => user.email === email && user.password === password);

            if (userData) {
                login({
                    fullName: userData.fullName, // Lấy tên thật của user từ dữ liệu đăng ký
                    email: userData.email,
                    phone: userData.phone
                });

                // Redirect về trang trước đó hoặc trang chủ
                const from = location.state?.from || '/';
                navigate(from);
            } else {
                setErrorMessage('Email hoặc mật khẩu không đúng');
            }
        } catch (error) {
            setErrorMessage('Có lỗi xảy ra khi đăng nhập');
        }

        // Here you would typically call your API for authentication
        console.log('Login attempt with:', { email, password });

        // For demo, simulate successful login and redirect
        // Replace this with actual authentication logic
        

    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-100 to-blue-50">
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex justify-center mb-8">
                            <LogoGHSMS />
                        </div>

                        <h2 className="text-center text-2xl font-bold text-purple-600 mb-6">
                            Đăng nhập vào GHSMS
                        </h2>

                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                <span className="block sm:inline">{errorMessage}</span>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleLogin}>
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="name@example.com"
                                    />
                                </div>
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-1 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="••••••••"
                                    />
                                    {/*
                                    {password && (
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
                                    )}
                                    */}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Đăng nhập
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
                                        Hoặc đăng nhập với
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
                            <span className="text-sm text-gray-600">Chưa có tài khoản? </span>
                            <Link to="/signup" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Đăng ký ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}