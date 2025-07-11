import React, { useState, useEffect } from 'react';
import { Video, Phone, User } from 'lucide-react';
import AgoraVideoCall from './AgoraVideoCall'; // Thay đổi import
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
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  const callStatusRef = ref(database, `calls/${appointment.id}`);

  useEffect(() => {
    if (!isConsultant) {
      const started = localStorage.getItem(`call_started_${appointment.id}`);
      if (started) {
        setIsCallActive(true);
      }
    }
  }, [isConsultant, appointment.id]);

  const startCall = async () => {
    setLoading(true);
    try {
      await set(callStatusRef, { status: "active" });
      setIsCallActive(true);
    } catch (error) {
      showToast('Lỗi: Không thể khởi tạo cuộc gọi trên server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCallEnd = async () => {
    await remove(callStatusRef);
    onClose();
  };

  useEffect(() => {
    onValue(callStatusRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data && data.status === "active") {
        if (!isConsultant) {
          setIsCallActive(true);
        }
      } else if (!data && isCallActive) {
        if (isCallActive) {
            showToast("Cuộc gọi đã kết thúc.", "info");
            onClose();
        }
      }
    });

    return () => {
      off(callStatusRef);
    };
  }, [isConsultant, appointment.id, isCallActive, onClose]);

  // Sử dụng AgoraVideoCall thay vì VideoCall
  if (isCallActive) {
    return (
      <AgoraVideoCall
        channelName={`apt_${appointment.id}`}
        token={null} // Null cho testing
        onCallEnd={handleCallEnd}
        appointment={appointment}
        isConsultant={isConsultant}
      />
    );
  }

  if (isConsultant) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bắt đầu tư vấn video</h3>
                <p className="text-sm text-gray-600">Sử dụng công nghệ Agora cho chất lượng cuộc gọi tốt nhất</p>
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
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang tạo...
                        </>
                    ) : (
                        <>
                            <Phone size={16} /> 
                            Bắt đầu gọi
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    );
  }

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