import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import LogoGHSMS from '../Logo/LogoGHSMS';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email) {
            setMessage('Vui lòng nhập địa chỉ email');
            setIsSuccess(false);
            return;
        }
        
        // Here you would call your API to send a reset password email
        console.log('Reset password request for:', email);
        
        // For demo, show success message
        setMessage('Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu tới email của bạn');
        setIsSuccess(true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-100 to-blue-50">
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex justify-center mb-8">
                            <LogoGHSMS />
                        </div>
                        
                        <h2 className="text-center text-2xl font-bold text-purple-600 mb-2">
                            Quên mật khẩu
                        </h2>
                        <p className="text-center text-gray-600 mb-6">
                            Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu
                        </p>
                        
                        {message && (
                            <div className={`${isSuccess ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'} border px-4 py-3 rounded relative mb-4`}>
                                <span className="block sm:inline">{message}</span>
                            </div>
                        )}
                        
                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Gửi hướng dẫn khôi phục
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <Link to="/login" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
                                <ArrowLeft size={16} className="mr-1" />
                                Quay lại trang đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}