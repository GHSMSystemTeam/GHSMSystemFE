import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Component/Auth/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Yêu cầu đăng nhập</h2>
                        <p className="text-gray-600">
                            Vui lòng đăng nhập để sử dụng dịch vụ này
                        </p>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Kiểm tra role an toàn
    if (requiredRole) {
        // Chuyển đổi user.role thành string an toàn
        let userRole = "";
        if (typeof user.role === "string") {
            userRole = user.role.toLowerCase();
        } else if (typeof user.role === "object" && user.role?.name) {
            userRole = user.role.name.toLowerCase();
        } else if (typeof user.role === "number") {
            userRole = user.role.toString();
        }

        const requiredRoleLower = typeof requiredRole === "string" ? requiredRole.toLowerCase() : "";

        if (userRole !== requiredRoleLower) {
            return <Navigate to="/" state={{ from: location, message: "Không có quyền truy cập." }} replace />;
        }
    }

    return children;
}