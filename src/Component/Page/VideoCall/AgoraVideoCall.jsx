import React, { useState, useEffect, useRef } from 'react';
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

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const timerRef = useRef(null);
    const clientRef = useRef(null);
    const localTracksRef = useRef({ video: null, audio: null });
    const remoteUsersRef = useRef({});
    const isInitializedRef = useRef(false);
    // Fetch opponent info using video call details API
    useEffect(() => {
        const fetchOpponent = async () => {
            try {
                console.log('🔍 Fetching opponent info from call details...');
                console.log('🔍 Is Consultant:', isConsultant);
                console.log('🔍 Call ID:', callId);
                console.log('🔍 Appointment:', appointment);
                
                if (callId) {
                    // Get call details which includes full consultant and customer objects
                    console.log('🔍 Fetching call details from /api/video-calls/' + callId);
                    const response = await api.get(`/api/video-calls/${callId}`);
                    console.log('🔍 Call details API response:', response.data);
                    
                    const callDetails = response.data;
                    
                    if (isConsultant) {
                        // Get customer info from call details
                        const customer = callDetails.customerId;
                        console.log('🔍 Customer from call details:', customer);
                        
                        if (customer) {
                            const customerInfo = {
                                name: customer.name || 'Khách hàng',
                                email: customer.email,
                                phone: customer.phone,
                                role: customer.role?.name || 'customer'
                            };
                            console.log('✅ Setting customer info from call details:', customerInfo);
                            setOpponentInfo(customerInfo);
                        } else {
                            console.log('⚠️ No customer in call details, using appointment fallback');
                            setOpponentInfo({
                                name: appointment.customerName || appointment.customer?.name || appointment.customer?.fullName || 'Khách hàng',
                                email: appointment.customerEmail,
                                phone: appointment.phone || 'N/A'
                            });
                        }
                    } else {
                        // Get consultant info from call details
                        const consultant = callDetails.consultantId;
                        console.log('🔍 Consultant from call details:', consultant);
                        
                        if (consultant) {
                            const consultantInfo = {
                                name: consultant.name || 'Tư vấn viên',
                                email: consultant.email,
                                phone: consultant.phone,
                                specialization: consultant.specialization,
                                expYear: consultant.expYear,
                                avgRating: consultant.avgRating,
                                role: consultant.role?.name || 'consultant'
                            };
                            console.log('✅ Setting consultant info from call details:', consultantInfo);
                            setOpponentInfo(consultantInfo);
                        } else {
                            console.log('⚠️ No consultant in call details, using appointment fallback');
                            setOpponentInfo({
                                name: appointment.consultantName || appointment.consultant?.name || appointment.consultant?.fullName || 'Tư vấn viên',
                                email: appointment.consultantEmail,
                                phone: appointment.phone || 'N/A'
                            });
                        }
                    }
                } else {
                    console.log('⚠️ No call ID available, using appointment data directly');
                    // Fallback to appointment data if no call ID
                    if (isConsultant) {
                        const customerInfo = {
                            name: appointment.customerName || 
                                appointment.customer?.name || 
                                appointment.customer?.fullName || 
                                'Khách hàng',
                            email: appointment.customerEmail || appointment.customer?.email,
                            phone: appointment.customer?.phone || appointment.phone || 'N/A',
                            role: 'customer'
                        };
                        console.log('✅ Setting customer info from appointment:', customerInfo);
                        setOpponentInfo(customerInfo);
                    } else {
                        const consultantInfo = {
                            name: appointment.consultantName || 
                                appointment.consultant?.name || 
                                appointment.consultant?.fullName || 
                                'Tư vấn viên',
                            email: appointment.consultantEmail || appointment.consultant?.email,
                            phone: appointment.consultant?.phone || appointment.phone || 'N/A',
                            specialization: appointment.consultant?.specialization,
                            expYear: appointment.consultant?.expYear,
                            avgRating: appointment.consultant?.avgRating,
                            role: 'consultant'
                        };
                        console.log('✅ Setting consultant info from appointment:', consultantInfo);
                        setOpponentInfo(consultantInfo);
                    }
                }
            } catch (error) {
                console.error('❌ Error fetching call details:', error);
                // Set fallback info from appointment
                const fallbackInfo = {
                    name: isConsultant 
                        ? (appointment.customerName || appointment.customer?.name || appointment.customer?.fullName || 'Khách hàng')
                        : (appointment.consultantName || appointment.consultant?.name || appointment.consultant?.fullName || 'Tư vấn viên'),
                    email: isConsultant ? appointment.customerEmail : appointment.consultantEmail,
                    phone: appointment.phone || 'N/A',
                    role: isConsultant ? 'customer' : 'consultant'
                };
                console.log('✅ Setting error fallback info:', fallbackInfo);
                setOpponentInfo(fallbackInfo);
            }
        };
        
        // Only fetch when we have callId or appointment, and don't have opponentInfo yet
        if ((callId || appointment) && !opponentInfo) {
            fetchOpponent();
        }
    }, [isConsultant, callId, appointment, opponentInfo]);


    // Initialize video call through API
    useEffect(() => {
        const initiateCall = async () => {
            if (isInitializedRef.current || !appointment?.id) return;
            
            try {
                // Initiate call through API
                const response = await api.post('/api/video-calls/initiate', {
                    consultantId: appointment.consultantId || appointment.consultant?.id,
                    customerId: appointment.customerId || appointment.customer?.id,
                    callType: 'consultation'
                });

                const { callId: newCallId, channelName: apiChannelName, appId } = response.data;
                setCallId(newCallId);
                
                // Use API provided channel name and app ID
                await initAgora(apiChannelName || `${CHANNEL_PREFIX}${appointment.id}`, appId || APP_ID);
                
            } catch (error) {
                console.error('❌ Error initiating call through API:', error);
                // Fallback to direct Agora initialization
                await initAgora(`${CHANNEL_PREFIX}${appointment.id}`, APP_ID);
            }
        };

        initiateCall();
        
        return () => {
            cleanup();
        };
    }, [appointment?.id]);

    // Initialize Agora client
    const initAgora = async (channelName, appId) => {
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;
        
        try {
            // Create Agora client
            const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            clientRef.current = client;

            // Set up event handlers
            client.on('user-published', handleUserPublished);
            client.on('user-unpublished', handleUserUnpublished);
            client.on('connection-state-change', handleConnectionStateChange);

            // Join channel
            const uid = await client.join(
                appId,
                channelName,
                token || null,
                null
            );

            console.log('🎯 Joined Agora channel with UID:', uid);

            // Create local tracks
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

            // Play local video
            if (localVideoRef.current) {
                videoTrack.play(localVideoRef.current);
            }

            // Publish tracks
            await client.publish([audioTrack, videoTrack]);
            console.log('✅ Successfully published local tracks');

            // Accept call through API if customer
            if (!isConsultant && callId) {
                await api.post(`/api/video-calls/${callId}/accept`, null, {
                    params: { userId: appointment.customerId || appointment.customer?.id }
                });
            }
            
        } catch (error) {
            console.error('❌ Error initializing Agora:', error);
            isInitializedRef.current = false;
        }
    };

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

    // Call timer
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

    const endCall = async () => {
        try {
            // End call through API
            if (callId) {
                await api.post(`/api/video-calls/${callId}/end`, null, {
                    params: { 
                        userId: isConsultant 
                            ? appointment.consultantId || appointment.consultant?.id
                            : appointment.customerId || appointment.customer?.id 
                    }
                });
            }
        } catch (error) {
            console.error('Error ending call through API:', error);
        }
        
        await cleanup();
        onCallEnd?.(callDuration);
    };

    // Get display name with better fallback logic and debug logging
    const getDisplayName = () => {
        console.log('🔍 Getting display name...');
        console.log('🔍 opponentInfo:', opponentInfo);
        console.log('🔍 appointment:', appointment);
        
        if (opponentInfo?.name) {
            console.log('🔍 Using opponentInfo.name:', opponentInfo.name);
            return opponentInfo.name;
        }
        
        // Try to get name from appointment data
        if (isConsultant) {
            const fallbackName = appointment?.customerName || 
                appointment?.customer?.name || 
                appointment?.customer?.fullName || 
                'Khách hàng';
            console.log('🔍 Using fallback customer name:', fallbackName);
            return fallbackName;
        } else {
            const fallbackName = appointment?.consultantName || 
                appointment?.consultant?.name || 
                appointment?.consultant?.fullName || 
                'Tư vấn viên';
            console.log('🔍 Using fallback consultant name:', fallbackName);
            return fallbackName;
        }
    };
    // Get current user name from local storage
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
                        {isConsultant 
                            ? `Tư vấn với ${displayName}` 
                            : `Tư vấn với ${displayName}`
                        }
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
                        <div
                            ref={localVideoRef}
                            className="w-full h-full"
                        />
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
                {opponentInfo && (
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <User size={16} />
                            {isConsultant ? 'Thông tin khách hàng' : 'Thông tin tư vấn viên'}
                        </h4>
                        <div className="space-y-1">
                        <p className="text-sm font-medium">
                            📝 Tên: {opponentInfo?.name || (isConsultant ? 'Khách hàng' : 'Tư vấn viên')}
                        </p>
                        {(opponentInfo?.phone && opponentInfo.phone !== 'N/A') && (
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
                        </div>
                    </div>
                )}
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