import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useToast } from '../Toast/ToastProvider';

export const useAuthCheck = () => {
    const { showToast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();

    const checkAuthAndShowPrompt = (action) => {
        if (!user) {
            const confirmed = window.confirm('Vui lòng đăng nhập để sử dụng dịch vụ này. Bạn có muốn đăng nhập ngay?');
            if (confirmed) {
                navigate('/login', { state: { from: window.location.pathname } });
            }
            return false;
        }
        return true;
    };

    return { checkAuthAndShowPrompt };
};