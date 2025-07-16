import React, { useState, useEffect } from 'react';
import { Video, Phone, User, RefreshCw } from 'lucide-react';
import AgoraVideoCall from './AgoraVideoCall';
import { useToast } from '../../Toast/ToastProvider';
import { useAuth } from '../../Auth/AuthContext';
import api from '../../config/axios';

const VideoCallManager = ({ appointment, onClose, isConsultant = true }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [callId, setCallId] = useState(null);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Customer: Check callId (localStorage, API, broadcast)
  const checkCallAvailable = async () => {
    setFetching(true);
    // 1. Check localStorage
    const callIdLS = localStorage.getItem(`activeCallId_${appointment.id}`);
    if (callIdLS) {
      setCallId(callIdLS);
      setIsCallActive(true);
      setFetching(false);
      return;
    }
    // 2. Try API
    try {
      const res = await api.get('/api/video-calls/videcalls');
      if (Array.isArray(res.data)) {
        const found = res.data.find(
          call =>
            call.consultantId?.id === appointment.consultantId?.id &&
            call.customerId?.id === appointment.customerId?.id &&
            (call.status === 'ACTIVE' || call.status === 'INITIATED')
        );
        if (found) {
          localStorage.setItem(`activeCallId_${appointment.id}`, found.id);
          setCallId(found.id);
          setIsCallActive(true);
          setFetching(false);
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    setFetching(false);
  };

  useEffect(() => {
    if (!isConsultant) {
      checkCallAvailable();
      // Listen for broadcast
      const channel = new BroadcastChannel(`appointment_${appointment.id}`);
      const handleMessage = (event) => {
        if (event.data.type === 'CALL_READY') {
          localStorage.setItem(`activeCallId_${appointment.id}`, event.data.callId);
          setCallId(event.data.callId);
          setIsCallActive(true);
          channel.close();
        }
      };
      channel.addEventListener('message', handleMessage);
      return () => {
        channel.removeEventListener('message', handleMessage);
        channel.close();
      };
    }
    // eslint-disable-next-line
  }, [isConsultant, appointment.id, appointment.consultantId?.id, appointment.customerId?.id]);
  
  useEffect(() => {
      if (!isConsultant) {
          const channel = new BroadcastChannel(`appointment_${appointment.id}`);
          const handleMessage = (event) => {
              if (event.data.type === 'CALL_ENDED') {
                  handleCallEnd();
              }
          };
          channel.addEventListener('message', handleMessage);
          return () => {
              channel.removeEventListener('message', handleMessage);
              channel.close();
          };
      }
  }, [isConsultant, appointment.id]);
  const startCall = async () => {
    if (!isConsultant) return;
    setLoading(true);
    setIsCallActive(true); // Render AgoraVideoCall, call sẽ được tạo ở đó
    setLoading(false);
  };

  const handleCallEnd = async () => {
    try {
      localStorage.removeItem(`activeCallId_${appointment.id}`);
    } catch {}
    setIsCallActive(false);
    setCallId(null);
    onClose();
  };

  // Khi đã có callId, render AgoraVideoCall
  if (isCallActive) {
    return (
      <AgoraVideoCall
        onCallEnd={handleCallEnd}
        appointment={appointment}
        isConsultant={isConsultant}
        callId={callId}
      />
    );
  }

  // Consultant UI
  if (isConsultant) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video size={32} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Bắt đầu tư vấn video</h3>
            <p className="text-sm text-gray-600">
              Khách hàng sẽ tự động được kết nối khi bạn bắt đầu cuộc gọi
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <User size={20} className="text-gray-500" />
              <div>
                <p className="font-medium">{appointment.customerId?.name || appointment.customerName}</p>
                <p className="text-sm text-gray-500">
                  {appointment.customerId?.phone || appointment.customerPhone}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
              onClick={startCall} 
              disabled={loading} 
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
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

  // Customer waiting UI
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video size={32} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Chờ tư vấn viên bắt đầu cuộc gọi...</h3>
        <p className="text-gray-600 mb-4">
          Hệ thống sẽ tự động cho phép bạn tham gia khi tư vấn viên sẵn sàng.
        </p>
        <div className="space-y-2 mb-6">
          <p className="text-sm font-medium">
            Tư vấn viên: {appointment.consultantId?.name || appointment.consultantName}
          </p>
          <p className="text-sm text-gray-500">
            Chuyên môn: {appointment.consultantId?.specialization || 'Tổng quát'}
          </p>
        </div>
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <button
          onClick={checkCallAvailable}
          disabled={fetching}
          className="mt-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
          {fetching ? "Đang kiểm tra..." : "Thử lại"}
        </button>
        <button 
          onClick={onClose} 
          className="mt-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default VideoCallManager;