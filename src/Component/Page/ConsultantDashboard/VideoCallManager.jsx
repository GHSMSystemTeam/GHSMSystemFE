import React, { useState, useEffect } from 'react';
import { Video, Phone, Clock, User } from 'lucide-react';
import VideoCall from './VideoCall';
import api from '../../config/axios';
import { useToast } from '../../Toast/ToastProvider';
import { useAuth } from '../../Auth/AuthContext';

import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off, remove } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://ghsms-fe-default-rtdb.asia-southeast1.firebasedatabase.app/", 
};

let app;
if (!getApps().some(app => app.name === "videoCallApp")) {
  app = initializeApp(firebaseConfig, "videoCallApp");
} else {
  app = getApp("videoCallApp");
}
const database = getDatabase(app);

const VideoCallManager = ({ appointment, onClose, isConsultant = true }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callToken, setCallToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Tạo một "phòng" duy nhất cho mỗi cuộc hẹn trên Firebase
  const callStatusRef = ref(database, `calls/${appointment.id}`);

  // Khi là consultant: phải bấm "Bắt đầu gọi"
  // Khi là customer: kiểm tra trạng thái phòng, nếu đã có thì join luôn
  useEffect(() => {
    if (!isConsultant) {
      // Giả lập: kiểm tra trạng thái phòng gọi (ở đây chỉ check localStorage, thực tế nên check backend)
      const started = localStorage.getItem(`call_started_${appointment.id}`);
      if (started) {
        setCallToken('demo-token');
        setIsCallActive(true);
      }
    }
  }, [isConsultant, appointment.id]);

  // Start video call (simplified version)
  const startCall = async () => {
    setLoading(true);
    try {
      // Ghi trạng thái "active" lên Firebase để khách hàng biết
      await set(callStatusRef, { status: "active" });
      
      // Các bước còn lại giữ nguyên
      setCallToken('demo-token'); // Trong thực tế, token này sẽ từ Agora/Twilio
      setIsCallActive(true);
    } catch (error) {
      showToast('Lỗi: Không thể khởi tạo cuộc gọi trên server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // End call callback
  const handleCallEnd = async () => {
    // Xóa trạng thái cuộc gọi trên Firebase
    await remove(callStatusRef);
    onClose(); // Đóng modal
  };

  useEffect(() => {
    // Bắt đầu lắng nghe sự kiện từ "phòng" trên Firebase
    onValue(callStatusRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data && data.status === "active") {
        // Nếu là khách hàng, tự động vào cuộc gọi khi tư vấn viên đã bắt đầu
        if (!isConsultant) {
          setCallToken('demo-token');
          setIsCallActive(true);
        }
      } else if (!data && isCallActive) {
        // Nếu dữ liệu bị xóa (cuộc gọi kết thúc), đóng modal
        if (isCallActive) {
            showToast("Cuộc gọi đã kết thúc.", "info");
            onClose();
        }
      }
    });
    // Dọn dẹp listener khi component bị hủy (đóng modal)
    return () => {
      off(callStatusRef);
    };
  }, [isConsultant, appointment.id, isCallActive, onClose]);

  if (isCallActive && callToken) {
    return (
      <VideoCall
        channelName={`consultation_${appointment.id}`}
        token={callToken}
        onCallEnd={handleCallEnd}
        appointment={appointment} // <-- thêm dòng này
        isConsultant={isConsultant}
      />
    );
  }
  // Giao diện cho Consultant (chưa bắt đầu)
  if (isConsultant) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            {/* Phần hiển thị thông tin giữ nguyên */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bắt đầu tư vấn video</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <User size={20} className="text-gray-500" />
                    <p className="font-medium">{appointment.customerId?.name}</p>
                </div>
            </div>
            {/* Nút bấm */}
            <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                <button onClick={startCall} disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? 'Đang tạo...' : <><Phone size={16} /> Bắt đầu gọi</>}
                </button>
            </div>
        </div>
      </div>
    );
  }
  // 2. Nếu là TƯ VẤN VIÊN và cuộc gọi CHƯA bắt đầu -> Hiển thị modal "Bắt đầu gọi"
  if (isConsultant) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bắt đầu tư vấn video</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <User size={20} className="text-gray-500" />
                    <p className="font-medium">{appointment.customerId?.name}</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                <button onClick={startCall} disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? 'Đang tạo...' : <><Phone size={16} /> Bắt đầu gọi</>}
                </button>
            </div>
        </div>
      </div>
    );
  }

  // 3. Nếu là KHÁCH HÀNG và cuộc gọi CHƯA bắt đầu -> Hiển thị modal "Chờ"
  // Đây là trường hợp cuối cùng, không cần if
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 text-center">
        <h3 className="text-xl font-bold mb-2">Chờ tư vấn viên bắt đầu cuộc gọi...</h3>
        <p className="text-gray-600 mb-4">Hệ thống sẽ tự động kết nối khi tư vấn viên sẵn sàng.</p>
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <button onClick={onClose} className="mt-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
      </div>
    </div>
  );
};

export default VideoCallManager;