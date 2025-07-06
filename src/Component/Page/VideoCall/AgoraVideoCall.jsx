import React, { useState, useEffect, useRef, useMemo } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Users, User } from 'lucide-react';
import api from '../../config/axios';

// Agora configuration
const APP_ID = '0c5416d1967d4f898697b07fe67eb30d';
const CHANNEL_PREFIX = 'consultation_';

const AgoraVideoCall = ({
    channelName,
    token,
    onCallEnd,
    appointment,
    isConsultant = true
}) => {
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [callDuration, setCallDuration] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [opponentInfo, setOpponentInfo] = useState(null);
    const [connectionState, setConnectionState] = useState('DISCONNECTED');
    const [callId, setCallId] = useState(null);
    const [callStartTime, setCallStartTime] = useState(null); // Thêm state để track thời gian bắt đầu

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const timerRef = useRef(null);
    const clientRef = useRef(null);
    const localTracksRef = useRef({ video: null, audio: null });
    const remoteUsersRef = useRef({});
    const isInitializedRef = useRef(false);

    // BƯỚC 1: Chuẩn hóa IDs một cách nhất quán bằng useMemo
    const { consultantId, customerId, currentUserId } = useMemo(() => {
        console.log('🔍 Parsing appointment data:', appointment);
        
        // Lấy consultant ID
        const cstId = appointment?.consultantId?.id || 
                     appointment?.consultant?.id || 
                     appointment?.consultantId;
        
        // Lấy customer ID  
        const csmId = appointment?.customerId?.id || 
                     appointment?.customer?.id || 
                     appointment?.customerId;
        
        // Current user ID dựa trên role
        const currentId = isConsultant ? cstId : csmId;
        
        console.log('✅ IDs extracted:', {
            consultantId: cstId,
            customerId: csmId,
            currentUserId: currentId,
            isConsultant
        });
        
        return {
            consultantId: cstId,
            customerId: csmId,
            currentUserId: currentId
        };
    }, [appointment, isConsultant]);

    // BƯỚC 2: Fetch thông tin đối phương từ API call details
    useEffect(() => {
        const fetchOpponentFromCallDetails = async () => {
            if (!callId) {
                console.log('⚠️ No callId available for fetching opponent details');
                return;
            }
            
            try {
                console.log(`🔍 Fetching call details for callId: ${callId}`);
                const response = await api.get(`/api/video-calls/${callId}`);
                const callDetails = response.data;
                
                console.log('✅ Call details received:', callDetails);
                
                // Lấy thông tin đối phương dựa trên role
                const opponent = isConsultant ? callDetails.customerId : callDetails.consultantId;
                
                if (opponent) {
                    const opponentData = {
                        name: opponent.name || 'Unknown',
                        email: opponent.email,
                        phone: opponent.phone,
                        specialization: opponent.specialization,
                        expYear: opponent.expYear,
                        avgRating: opponent.avgRating,
                        role: isConsultant ? 'customer' : 'consultant'
                    };
                    
                    console.log('✅ Opponent info set from API:', opponentData);
                    setOpponentInfo(opponentData);
                } else {
                    console.warn('⚠️ No opponent data in call details');
                }
                
            } catch (error) {
                console.error('❌ Error fetching call details:', error);
                console.error('❌ Error response:', error.response?.data);
            }
        };

        if (callId && !opponentInfo) {
            fetchOpponentFromCallDetails();
        }
    }, [callId, isConsultant, opponentInfo]);

    // BƯỚC 3: Fallback opponent info từ appointment nếu không có từ API
    useEffect(() => {
        if (appointment && !opponentInfo) {
            console.log('🔧 Setting fallback opponent info from appointment');
            
            const fallbackInfo = {
                name: isConsultant 
                    ? (appointment.customerId?.name || appointment.customerName || appointment.customer?.name || 'Khách hàng')
                    : (appointment.consultantId?.name || appointment.consultantName || appointment.consultant?.name || 'Tư vấn viên'),
                email: isConsultant 
                    ? (appointment.customerId?.email || appointment.customerEmail || appointment.customer?.email)
                    : (appointment.consultantId?.email || appointment.consultantEmail || appointment.consultant?.email),
                phone: isConsultant 
                    ? (appointment.customerId?.phone || appointment.customer?.phone || appointment.phone)
                    : (appointment.consultantId?.phone || appointment.consultant?.phone || appointment.phone),
                role: isConsultant ? 'customer' : 'consultant'
            };
            
            console.log('🔧 Fallback opponent info:', fallbackInfo);
            setOpponentInfo(fallbackInfo);
        }
    }, [appointment, isConsultant, opponentInfo]);

    // BƯỚC 4: Khởi tạo cuộc gọi qua API và lưu callId
    useEffect(() => {
        const initiateVideoCall = async () => {
            if (isInitializedRef.current || !consultantId || !customerId) {
                console.log('⚠️ Cannot initiate call:', { 
                    initialized: isInitializedRef.current, 
                    consultantId, 
                    customerId 
                });
                return;
            }
            
            try {
                console.log('🚀 Initiating video call via API...');
                console.log('📝 Request payload:', {
                    consultantId: String(consultantId),
                    customerId: String(customerId),
                    callType: 'video'
                });
                
                const response = await api.post('/api/video-calls/initiate', {
                    consultantId: String(consultantId),
                    customerId: String(customerId),
                    callType: 'video'
                });

                console.log('✅ Video call initiated successfully');
                console.log('📋 API Response:', response.data);
                
                const { callId: newCallId, channelName: apiChannelName, appId } = response.data;
                
                // LƯU CALLID VÀO STATE
                setCallId(newCallId);
                setCallStartTime(new Date()); // Lưu thời gian bắt đầu
                
                console.log(`✅ Call ID saved: ${newCallId}`);
                console.log(`✅ Call started at: ${new Date()}`);
                
                // Khởi tạo Agora với thông tin từ API
                await initAgora(
                    apiChannelName || `${CHANNEL_PREFIX}${appointment.id}`, 
                    appId || APP_ID,
                    newCallId
                );
                
            } catch (error) {
                console.error('❌ Error initiating video call:', error);
                console.error('❌ Error details:', error.response?.data);
                
                // Fallback: khởi tạo Agora trực tiếp nếu API lỗi
                console.log('🔄 Falling back to direct Agora initialization');
                await initAgora(`${CHANNEL_PREFIX}${appointment.id}`, APP_ID, null);
            }
        };

        initiateVideoCall();
        
        return () => {
            cleanup();
        };
    }, [consultantId, customerId, appointment?.id]);

    // BƯỚC 5: Khởi tạo Agora và accept call nếu là customer
    const initAgora = async (channelName, appId, currentCallId) => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;
        
        try {
            console.log('🎯 Initializing Agora...');
            console.log('📝 Agora params:', { channelName, appId, currentCallId });
            
            const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            clientRef.current = client;

            client.on('user-published', handleUserPublished);
            client.on('user-unpublished', handleUserUnpublished);
            client.on('connection-state-change', handleConnectionStateChange);

            const uid = await client.join(appId, channelName, token || null, null);
            console.log('✅ Joined Agora channel with UID:', uid);

            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
                {
                    echoCancellation: true,
                    noiseSuppression: true,
                },
                {
                    encoderConfig: {
                        width: 640,
                        height: 480,
                        frameRate: 15,
                        bitrateMax: 1000,
                    },
                    optimizationMode: 'motion',
                }
            );

            localTracksRef.current = { audio: audioTrack, video: videoTrack };

            if (localVideoRef.current) {
                videoTrack.play(localVideoRef.current);
            }

            await client.publish([audioTrack, videoTrack]);
            console.log('✅ Published local tracks successfully');

            // ACCEPT CALL NẾU LÀ CUSTOMER VÀ CÓ CALLID
            if (!isConsultant && currentCallId && currentUserId) {
                console.log('🎯 Customer accepting call...');
                console.log('📝 Accept params:', { callId: currentCallId, userId: currentUserId });
                
                try {
                    await api.post(`/api/video-calls/${currentCallId}/accept`, null, {
                        params: { userId: String(currentUserId) }
                    });
                    console.log('✅ Call accepted successfully by customer');
                } catch (acceptError) {
                    console.error('❌ Error accepting call:', acceptError);
                    console.error('❌ Accept error details:', acceptError.response?.data);
                }
            }
            
        } catch (error) {
            console.error('❌ Error initializing Agora:', error);
            isInitializedRef.current = false;
        }
    };

    // ... (Các hàm handle events không đổi)
    const handleUserPublished = async (user, mediaType) => {
        try {
            await clientRef.current.subscribe(user, mediaType);
            console.log('Subscribed to user:', user.uid, 'mediaType:', mediaType);

            if (mediaType === 'video') {
                setIsConnected(true);
                if (remoteVideoRef.current) {
                    user.videoTrack?.play(remoteVideoRef.current);
                }
            }

            if (mediaType === 'audio') {
                user.audioTrack?.play();
            }

            remoteUsersRef.current[user.uid] = user;
        } catch (error) {
            console.error('Error subscribing to user:', error);
        }
    };

    const handleUserUnpublished = (user, mediaType) => {
        console.log('User unpublished:', user.uid, 'mediaType:', mediaType);
        
        if (mediaType === 'video' && remoteVideoRef.current) {
            remoteVideoRef.current.innerHTML = '';
        }

        delete remoteUsersRef.current[user.uid];

        if (Object.keys(remoteUsersRef.current).length === 0) {
            setIsConnected(false);
        }
    };

    const handleConnectionStateChange = (curState, revState) => {
        console.log('Connection state changed:', curState);
        setConnectionState(curState);
    };

    // Timer cho cuộc gọi
    useEffect(() => {
        if (isConnected) {
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isConnected]);

    const toggleMic = async () => {
        if (localTracksRef.current.audio) {
            await localTracksRef.current.audio.setEnabled(!micOn);
            setMicOn(!micOn);
        }
    };

    const toggleCamera = async () => {
        if (localTracksRef.current.video) {
            await localTracksRef.current.video.setEnabled(!cameraOn);
            setCameraOn(!cameraOn);
        }
    };

    const cleanup = async () => {
        try {
            isInitializedRef.current = false;
            
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            if (localTracksRef.current.audio) {
                localTracksRef.current.audio.stop();
                localTracksRef.current.audio.close();
            }
            if (localTracksRef.current.video) {
                localTracksRef.current.video.stop();
                localTracksRef.current.video.close();
            }

            if (clientRef.current) {
                await clientRef.current.leave();
                clientRef.current.removeAllListeners();
            }

            console.log('Cleanup completed');
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    };

    // BƯỚC 6: Kết thúc cuộc gọi với callId và userId đúng + LOG THỜI GIAN
    const endCall = async () => {
        const callEndTime = new Date();
        const duration = callStartTime ? Math.floor((callEndTime - callStartTime) / 1000) : callDuration;
        
        console.log('🔚 Ending video call...');
        console.log('📝 Call timing:', {
            startTime: callStartTime,
            endTime: callEndTime,
            durationSeconds: duration,
            callDurationState: callDuration
        });
        
        try {
            if (callId && currentUserId) {
                console.log('📝 End call params:', { 
                    callId, 
                    userId: currentUserId,
                    userIdString: String(currentUserId)
                });
                
                await api.post(`/api/video-calls/${callId}/end`, null, {
                    params: { userId: String(currentUserId) }
                });
                
                console.log('✅ Call ended successfully via API');
                console.log('📊 Final call stats:', {
                    callId,
                    userId: currentUserId,
                    duration: duration,
                    isConsultant
                });
                
            } else {
                console.warn('⚠️ Cannot end call via API: missing data');
                console.warn('⚠️ Missing data:', { callId, currentUserId });
            }
        } catch (error) {
            console.error('❌ Error ending call via API:', error);
            console.error('❌ End call error details:', error.response?.data);
        }
        
        await cleanup();
        onCallEnd?.(duration);
    };

    // Get display name với fallback tốt hơn
    const getDisplayName = () => {
        if (opponentInfo?.name) {
            return opponentInfo.name;
        }
        
        if (isConsultant) {
            return appointment?.customerId?.name ||
                   appointment?.customerName || 
                   appointment?.customer?.name || 
                   'Khách hàng';
        } else {
            return appointment?.consultantId?.name ||
                   appointment?.consultantName || 
                   appointment?.consultant?.name || 
                   'Tư vấn viên';
        }
    };

    const getCurrentUserName = () => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        return currentUser.name || currentUser.fullName || 'Bạn';
    };

    const displayName = getDisplayName();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50">
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold">
                            Tư vấn với {displayName}
                        </h3>
                        <p className="text-sm text-gray-300">
                            {isConnected 
                                ? `Thời gian: ${String(Math.floor(callDuration/60)).padStart(2,'0')}:${String(callDuration%60).padStart(2,'0')}` 
                                : connectionState === 'CONNECTING' ? 'Đang kết nối...' : 'Chờ kết nối...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-sm ${
                        isConnected ? 'bg-green-600' : 
                        connectionState === 'CONNECTING' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                        {isConnected ? 'Đã kết nối' : 
                         connectionState === 'CONNECTING' ? 'Đang kết nối' : 'Chưa kết nối'}
                    </div>
                    {callId && (
                        <div className="text-xs text-gray-400">
                            Call ID: {callId}
                        </div>
                    )}
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative">
                {/* Main video area - Remote video */}
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="relative w-full h-full max-w-4xl max-h-3xl bg-black rounded-xl flex items-center justify-center">
                        <div
                            ref={remoteVideoRef}
                            className="w-full h-full"
                            style={{
                                borderRadius: '1rem',
                                overflow: 'hidden'
                            }}
                        />
                        {!isConnected && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                    <Users size={40} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{displayName}</h3>
                                <p className="text-gray-300">
                                    {connectionState === 'CONNECTING' ? 'Đang kết nối...' : 'Chờ người dùng tham gia'}
                                </p>
                                {callStartTime && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        Bắt đầu: {callStartTime.toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                        )}
                        {isConnected && (
                            <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                                {displayName}
                            </div>
                        )}
                    </div>
                </div>

                {/* Local video (picture in picture) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
                    {cameraOn ? (
                        <div ref={localVideoRef} className="w-full h-full" />
                    ) : (
                        <div className="w-full h-full bg-gray-600 flex flex-col items-center justify-center text-white">
                            <VideoOff size={24} className="mb-2" />
                            <p className="text-sm">Camera tắt</p>
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                        {getCurrentUserName()}
                    </div>
                </div>

                {/* Participant info */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <User size={16} />
                        {isConsultant ? 'Thông tin khách hàng' : 'Thông tin tư vấn viên'}
                    </h4>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            📝 Tên: {displayName}
                        </p>
                        {opponentInfo?.phone && opponentInfo.phone !== 'N/A' && (
                            <p className="text-sm">📞 SĐT: {opponentInfo.phone}</p>
                        )}
                        {opponentInfo?.email && (
                            <p className="text-sm">✉️ Email: {opponentInfo.email}</p>
                        )}
                        {!isConsultant && opponentInfo?.specialization && (
                            <p className="text-sm">🎯 Chuyên môn: {opponentInfo.specialization}</p>
                        )}
                        {!isConsultant && opponentInfo?.expYear && (
                            <p className="text-sm">⏱️ Kinh nghiệm: {opponentInfo.expYear} năm</p>
                        )}
                        {!isConsultant && opponentInfo?.avgRating && (
                            <p className="text-sm">⭐ Đánh giá: {opponentInfo.avgRating}/5</p>
                        )}
                        {callId && (
                            <p className="text-xs text-gray-300 mt-2">Call ID: {callId}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="bg-gray-900 p-4">
                <div className="flex justify-center items-center space-x-4">
                    <button
                        onClick={toggleMic}
                        className={`p-3 rounded-full transition-colors ${
                            micOn 
                                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                : 'bg-red-600 hover:bg-red-500 text-white'
                        }`}
                        title={micOn ? 'Tắt micro' : 'Bật micro'}
                    >
                        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>

                    <button
                        onClick={toggleCamera}
                        className={`p-3 rounded-full transition-colors ${
                            cameraOn 
                                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                : 'bg-red-600 hover:bg-red-500 text-white'
                        }`}
                        title={cameraOn ? 'Tắt camera' : 'Bật camera'}
                    >
                        {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                    </button>

                    <button
                        onClick={endCall}
                        className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                        title="Kết thúc cuộc gọi"
                    >
                        <PhoneOff size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgoraVideoCall;