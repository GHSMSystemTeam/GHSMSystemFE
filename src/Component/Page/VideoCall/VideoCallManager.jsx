import React, { useState, useEffect } from 'react';
import { Video, Phone, User } from 'lucide-react';
import AgoraVideoCall from './AgoraVideoCall';
import { useToast } from '../../Toast/ToastProvider';
import { useAuth } from '../../Auth/AuthContext';

const VideoCallManager = ({ appointment, onClose, isConsultant = true }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Remove Firebase logic and use API-based approach
  useEffect(() => {
    if (!isConsultant) {
      // Customer: Check if there's already an active call
      const checkForActiveCall = async () => {
        try {
          const existingCallId = localStorage.getItem(`activeCallId_${appointment.id}`);
          if (existingCallId) {
            console.log('👤 Customer found existing call ID:', existingCallId);
            setIsCallActive(true);
            return;
          }
          
          // If no call in localStorage, customer waits
          console.log('👤 Customer waiting for consultant to start call...');
        } catch (error) {
          console.error('❌ Error checking for active call:', error);
        }
      };
      
      checkForActiveCall();
    }
  }, [isConsultant, appointment.id]);

  const startCall = async () => {
    if (!isConsultant) {
      console.log('⚠️ Only consultant can start calls');
      return;
    }

    setLoading(true);
    try {
      console.log('👨‍💼 Consultant starting call...');
      
      // Simply set call active - the API logic will be handled in AgoraVideoCall
      setIsCallActive(true);
      
      console.log('✅ Call started successfully');
    } catch (error) {
      console.error('❌ Error starting call:', error);
      showToast('Lỗi: Không thể khởi tạo cuộc gọi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCallEnd = async () => {
    console.log('🔚 Call ended, cleaning up...');
    
    // Clean up localStorage
    try {
      localStorage.removeItem(`activeCallId_${appointment.id}`);
      localStorage.removeItem(`channelName_${appointment.id}`);
      console.log('🧹 VideoCallManager cleaned up localStorage');
    } catch (error) {
      console.error('❌ Error cleaning localStorage:', error);
    }
    
    setIsCallActive(false);
    onClose();
  };

  // Customer polling logic to detect when consultant starts call
  useEffect(() => {
    if (!isConsultant && !isCallActive) {
      console.log('👤 Customer: Setting up polling for consultant call...');
      
      const checkInterval = setInterval(() => {
        const existingCallId = localStorage.getItem(`activeCallId_${appointment.id}`);
        const existingChannelName = localStorage.getItem(`channelName_${appointment.id}`);
        
        if (existingCallId && existingChannelName) {
          console.log('🎉 Customer detected consultant call!', { existingCallId, existingChannelName });
          setIsCallActive(true);
          clearInterval(checkInterval);
        }
      }, 1000); // Check every second
      
      return () => {
        clearInterval(checkInterval);
      };
    }
  }, [isConsultant, isCallActive, appointment.id]);

  // Use AgoraVideoCall with proper role detection
  if (isCallActive) {
    return (
      <AgoraVideoCall
        channelName={`apt_${appointment.id}`}
        token={null}
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video size={32} className="text-blue-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Chờ tư vấn viên bắt đầu cuộc gọi...</h3>
        <p className="text-gray-600 mb-4">
          Hệ thống sẽ tự động kết nối khi tư vấn viên sẵn sàng.
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