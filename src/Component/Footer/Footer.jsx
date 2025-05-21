import React from 'react'
import { Link } from 'react-router-dom'


export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Trung tâm Y học Giới tính TPHCM</h3>
                        <p className="mb-2">Địa chỉ: Đường 22, Thành phố Thủ Đức</p>
                        <p className="mb-2">Điện thoại: 0866.249.268</p>
                        <p className="mb-2">Email: ttyhgt@afTPHCM.com</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Giờ làm việc</h3>
                        <p className="mb-2">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
                        <p className="mb-2">Thứ 7 - Chủ nhật: 8:00 - 12:00</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Liên kết</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-blue-300">Trang chủ</Link></li>
                            <li><Link to="/about" className="hover:text-blue-300">Giới thiệu</Link></li>
                            <li><a href="#" className="hover:text-blue-300">Dịch vụ</a></li>
                            <li><a href="#" className="hover:text-blue-300">Liên hệ</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
                    <p>© {new Date().getFullYear()} Trung tâm Y học Giới tính TPHCM. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    )
}
