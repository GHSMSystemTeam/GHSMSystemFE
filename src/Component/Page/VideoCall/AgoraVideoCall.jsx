import React, { useState, useEffect, useRef, useMemo } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Users, User } from 'lucide-react';
import api from '../../config/axios';

// Agora configuration
const APP_ID = '0c5416d1967d4f898697b07fe67eb30d';

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
    const [callStartTime, setCallStartTime] = useState(null);
    const [callId, setCallId] = useState(null); 

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const timerRef = useRef(null);
    const clientRef = useRef(null);
    const localTracksRef = useRef({ video: null, audio: null });
    const remoteUsersRef = useRef({});
    const isInitializedRef = useRef(false);

    // PRIMARY: Super short channel name using just appointment ID
    const createShortChannelName = (appointmentId) => {
        // Just use appointment ID with prefix - guaranteed short
        const shortName = `apt_${appointmentId}`;
        console.log('📺 Generated short channel name:', shortName, 'Length:', shortName.length);
        return shortName;
    };

    // NEW: Function to shorten long channel names from API
    const shortenChannelName = (longChannelName) => {
        if (!longChannelName || longChannelName.length <= 64) {
            return longChannelName;
        }
        
        // Extract meaningful parts or create hash
        const parts = longChannelName.split('_');
        
        if (parts.length >= 2) {
            // Try to use first and last parts
            const firstPart = parts[0];
            const lastPart = parts[parts.length - 1];
            const shortened = `${firstPart}_${lastPart}`;
            
            if (shortened.length <= 64) {
                console.log('✂️ Shortened channel name:', shortened, 'Length:', shortened.length);
                return shortened;
            }
        }
        
        // If still too long, create a hash-based name
        const hash = longChannelName.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        const shortName = `call_${Math.abs(hash)}`;
        console.log('🔨 Created hash-based channel name:', shortName, 'Length:', shortName.length);
        return shortName;
    };

    // BƯỚC 1: Lấy thông tin người dùng từ appointment
    const { consultantInfo, customerInfo, currentUserName } = useMemo(() => {
        console.log('🔍 Parsing appointment data:', appointment);
        
        const consultant = {
            id: appointment?.consultantId?.id || appointment?.consultant?.id || appointment?.consultantId,
            name: appointment?.consultantId?.name || appointment?.consultant?.name || appointment?.consultantName || 'Tư vấn viên',
            email: appointment?.consultantId?.email || appointment?.consultant?.email || appointment?.consultantEmail,
            phone: appointment?.consultantId?.phone || appointment?.consultant?.phone || appointment?.consultantPhone,
            specialization: appointment?.consultantId?.specialization || appointment?.consultant?.specialization,
            expYear: appointment?.consultantId?.expYear || appointment?.consultant?.expYear,
            avgRating: appointment?.consultantId?.avgRating || appointment?.consultant?.avgRating
        };

        const customer = {
            id: appointment?.customerId?.id || appointment?.customer?.id || appointment?.customerId,
            name: appointment?.customerId?.name || appointment?.customer?.name || appointment?.customerName || 'Khách hàng',
            email: appointment?.customerId?.email || appointment?.customer?.email || appointment?.customerEmail,
            phone: appointment?.customerId?.phone || appointment?.customer?.phone || appointment?.phone
        };

        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const currentName = currentUser.name || currentUser.fullName || 'Bạn';

        console.log('✅ User info extracted:', { consultant, customer, currentName, isConsultant });
        
        return {
            consultantInfo: consultant,
            customerInfo: customer,
            currentUserName: currentName
        };
    }, [appointment, isConsultant]);

    // BƯỚC 2: Set opponent info
    useEffect(() => {
        const opponent = isConsultant ? customerInfo : consultantInfo;
        setOpponentInfo({
            ...opponent,
            role: isConsultant ? 'customer' : 'consultant'
        });
        console.log('✅ Opponent info set:', opponent);
    }, [isConsultant, consultantInfo, customerInfo]);

    // BƯỚC 3: Khởi tạo cuộc gọi qua API trước
    useEffect(() => {
        const initiateVideoCall = async () => {
            if (isInitializedRef.current || !appointment?.id || !consultantInfo?.id || !customerInfo?.id) {
                console.log('⚠️ Call initialization delayed: Waiting for complete appointment data...', {
                    initialized: isInitializedRef.current,
                    appointmentId: appointment?.id,
                    consultantId: consultantInfo?.id,
                    customerId: customerInfo?.id,
                });
               return;
            }

            try {
                console.log('🚀 Initiating video call via API...');
                
                // Extract IDs properly from appointment
                const consultantId = consultantInfo.id;
                const customerId = customerInfo.id;

                // Enhanced validation to catch potential issues
                if (!consultantId || consultantId === 'undefined' || consultantId === 'null') {
                    throw new Error(`Invalid consultantId: "${consultantId}"`);
                }

                if (!customerId || customerId === 'undefined' || customerId === 'null') {
                    throw new Error(`Invalid customerId: "${customerId}"`);
                }

                console.log('🔍 Validated IDs:', { consultantId, customerId });

                // Prepare payload for API
                const payload = {
                    consultantId: String(consultantId).trim(),
                    customerId: String(customerId).trim(),
                    callType: "video"
                };

                console.log('📝 Sending API payload:', payload);
                const response = await api.post('/api/video-calls/initiate', payload);
                console.log('✅ Video call initiated successfully:', response.data);
                
                // IMPROVED: Extract all response fields according to API spec
                const { 
                    callId: newCallId, 
                    channelName: apiChannelName, 
                    appId, 
                    status, 
                    message 
                } = response.data;
                
                console.log('📋 API Response Details:', {
                    callId: newCallId,
                    channelName: apiChannelName,
                    appId,
                    status,
                    message
                });
            
                // Check for a valid status to proceed with the call
                if (status === "INITIATED" || status === "RINGING" || status === "ACTIVE") {
                    const callIdString = typeof newCallId === 'bigint'
                        ? newCallId.toString()
                        : String(newCallId);

                    setCallId(callIdString);
                    console.log(`✅ Call ID saved: ${callIdString}`);

                    const startTime = new Date();
                    setCallStartTime(startTime);
                    console.log('⏰ Call started at:', startTime.toLocaleTimeString());

                    // FIXED: Ưu tiên channel name từ props (VideoCallManager)
                    const finalChannelName = (() => {
                        // 1. Dùng channel name từ props trước (từ VideoCallManager)
                        if (channelName && channelName.trim()) {
                            console.log('🎯 Using channel name from props:', channelName);
                            return channelName.trim();
                        }
                        
                        // 2. Nếu không có, dùng từ API
                        if (apiChannelName && apiChannelName.trim()) {
                            const trimmedName = apiChannelName.trim();
                            if (trimmedName.length <= 64) {
                                console.log('🎯 Using API channel name:', trimmedName);
                                return trimmedName;
                            } else {
                                console.log('⚠️ API channel name too long, shortening:', trimmedName);
                                return shortenChannelName(trimmedName);
                            }
                        }
                        
                        // 3. Fallback: tạo channel name đơn giản
                        const fallbackName = createShortChannelName(appointment.id);
                        console.log('🎯 Using fallback channel name:', fallbackName);
                        return fallbackName;
                    })();

                    console.log('🎯 Final channel name decided:', finalChannelName, 'Length:', finalChannelName.length);

                    // IMPROVED: Use API appId if provided
                    const finalAppId = appId && appId.trim() ? appId.trim() : APP_ID;
                    console.log('🔑 Using App ID:', finalAppId);

                    await initAgora(finalChannelName, finalAppId);
                } else {
                    throw new Error(`Call initiation failed with unexpected status: ${status}`);
                }
            } catch (error) {
                console.error('❌ Error initiating video call:', error);

                // Enhanced error logging
                if (error.response) {
                    console.error('❌ API Error Details:');
                    console.error('  Status:', error.response.status);
                    console.error('  Status Text:', error.response.statusText);
                    console.error('  Response Data:', error.response.data);
                    console.error('  Request URL:', error.config?.url);
                    console.error('  Request Method:', error.config?.method);
                    console.error('  Request Data:', error.config?.data);

                    // IMPROVED: Handle specific HTTP status codes
                    switch (error.response.status) {
                        case 400:
                            console.error('❌ Bad Request: Check if consultantId and customerId are valid');
                            break;
                        case 401:
                            console.error('❌ Unauthorized: Check if user is logged in');
                            break;
                        case 403:
                            console.error('❌ Forbidden: User may not have permission to start calls');
                            break;
                        case 409:
                            console.error('❌ Conflict: There might be an active call already');
                            break;
                        case 500:
                            console.error('❌ Server Error: Backend issue');
                            break;
                        default:
                            console.error('❌ Unexpected error status');
                    }
                }

                // FIXED: Fallback với channel name từ props
                console.log('🔄 Attempting direct Agora initialization with props channel name...');
                try {
                    const fallbackChannelName = channelName || createShortChannelName(appointment.id);
                    console.log('🎯 Using fallback channel name:', fallbackChannelName);
                    
                    const startTime = new Date();
                    setCallStartTime(startTime);
                    console.log('⏰ Fallback call started at:', startTime.toLocaleTimeString());

                    await initAgora(fallbackChannelName, APP_ID);
                    console.log('✅ Direct Agora initialization successful');
                } catch (fallbackError) {
                    console.error('❌ Fallback initialization failed:', fallbackError);
                    
                    const errorMessage = error.response?.data?.message || 
                                       error.response?.data?.error ||
                                       error.message || 
                                       'Không thể khởi tạo cuộc gọi';
                    
                    alert(`Lỗi khởi tạo cuộc gọi: ${errorMessage}`);
                    onCallEnd?.();
                }
            }
        };    

        const timeoutId = setTimeout(initiateVideoCall, 100);

        return () => {
            clearTimeout(timeoutId);
            cleanup();
        };

    }, [appointment, consultantInfo, customerInfo, channelName]);

    // Event handlers for remote users - ADD MORE DEBUGGING
    const handleUserPublished = async (user, mediaType) => {
        console.log('👤 User published:', user.uid, 'Media type:', mediaType);
        console.log('📊 Remote video ref exists:', !!remoteVideoRef.current);
        try {
            await clientRef.current.subscribe(user, mediaType);
            console.log('✅ Subscribed to user:', user.uid, mediaType);

            if (mediaType === 'video') {
                console.log('🎥 Processing video track...');
                console.log('📊 User video track:', user.videoTrack);
                // Play remote video with better error handling
                if (remoteVideoRef.current) {
                    try {
                        console.log('▶️ Attempting to play remote video...');
                        user.videoTrack.play(remoteVideoRef.current);
                        console.log('✅ Playing remote video successfully');
                        setIsConnected(true);
                        
                        // Force a state update to trigger re-render
                        setTimeout(() => {
                            console.log('🔄 Remote video element content:', remoteVideoRef.current?.innerHTML);
                        }, 1000);
                        
                    } catch (playError) {
                        console.error('❌ Error playing remote video:', playError);
                        
                        // Retry after a short delay
                        setTimeout(() => {
                            try {
                                console.log('🔄 Retrying to play remote video...');
                                user.videoTrack.play(remoteVideoRef.current);
                                console.log('✅ Retry playing remote video successful');
                                setIsConnected(true);
                            } catch (retryError) {
                                console.error('❌ Retry playing remote video failed:', retryError);
                            }
                        }, 1000);
                    }
                } else {
                    console.error('❌ Remote video ref is null');
                }
            }
            
            if (mediaType === 'audio') {
                console.log('🔊 Processing audio track...');
                // Play remote audio
                try {
                    user.audioTrack.play();
                    console.log('▶️ Playing remote audio successfully');
                } catch (audioError) {
                    console.error('❌ Error playing remote audio:', audioError);
                }
            }

            // Store remote user
            remoteUsersRef.current[user.uid] = user;
            console.log('📊 Remote users count:', Object.keys(remoteUsersRef.current).length);
            console.log('📋 Remote users:', Object.keys(remoteUsersRef.current));
        } catch (subscribeError) {
            console.error('❌ Error subscribing to user:', subscribeError);
        }
    };

    const handleUserUnpublished = (user, mediaType) => {
        console.log('👤 User unpublished:', user.uid, 'Media type:', mediaType);
        
        if (mediaType === 'video') {
            // Remove video display
            if (remoteVideoRef.current) {
                remoteVideoRef.current.innerHTML = '';
                console.log('🧹 Cleared remote video display');
            }
        }
        
        // Clean up remote user if no more tracks
        if (!user.videoTrack && !user.audioTrack) {
            delete remoteUsersRef.current[user.uid];
            console.log('🗑️ Removed remote user:', user.uid);
            
            // Check if no more remote users
            if (Object.keys(remoteUsersRef.current).length === 0) {
                setIsConnected(false);
                console.log('⚠️ No more remote users, disconnected');
            }
        }
    };
    
    // Enhanced connection state handler
    const handleConnectionStateChange = (curState, prevState) => {
        console.log('🔄 Connection state changed:', prevState, '->', curState);
        setConnectionState(curState);
        
        switch (curState) {
            case 'CONNECTED':
                console.log('✅ Successfully connected to Agora');
                break;
            case 'CONNECTING':
                console.log('🔄 Connecting to Agora...');
                break;
            case 'DISCONNECTED':
                console.log('⚠️ Disconnected from Agora');
                break;
            case 'RECONNECTING':
                console.log('🔄 Reconnecting to Agora...');
                break;
            case 'FAILED':
                console.error('❌ Connection failed');
                // Try to reconnect
                setTimeout(() => {
                    if (clientRef.current && appointment?.id) {
                        console.log('🔄 Attempting to reconnect...');
                        const channelName = createShortChannelName(appointment.id);
                        initAgora(channelName, APP_ID).catch(console.error);
                    }
                }, 5000);
                break;
        }
    };

    // Control functions
    const toggleMic = async () => {
        if (localTracksRef.current.audio) {
            try {
                await localTracksRef.current.audio.setEnabled(!micOn);
                setMicOn(!micOn);
                console.log('🎤 Microphone', !micOn ? 'enabled' : 'disabled');
            } catch (error) {
                console.error('❌ Error toggling microphone:', error);
            }
        }
    };

    const toggleCamera = async () => {
        if (localTracksRef.current.video) {
            try {
                await localTracksRef.current.video.setEnabled(!cameraOn);
                setCameraOn(!cameraOn);
                console.log('📹 Camera', !cameraOn ? 'enabled' : 'disabled');
            } catch (error) {
                console.error('❌ Error toggling camera:', error);
            }
        }
    };

    // Timer effect for call duration
    useEffect(() => {
        if (isConnected && callStartTime) {
            timerRef.current = setInterval(() => {
                const now = new Date();
                const duration = Math.floor((now - callStartTime) / 1000);
                setCallDuration(duration);
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
    }, [isConnected, callStartTime]);

    // Network connectivity check
    const checkNetworkConnectivity = async () => {
        try {
            console.log('🔍 Checking network connectivity...');
            
            // Create AbortController for timeout support
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            try {
                // Check basic internet connectivity with manual timeout
                const response = await fetch('https://httpbin.org/get', { 
                    method: 'GET',
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    console.log('✅ Internet connectivity: OK');
                    return true;
                } else {
                    console.log('⚠️ Internet connectivity: Limited');
                    return false;
                }
            } catch (fetchError) {
                clearTimeout(timeoutId);
                
                if (fetchError.name === 'AbortError') {
                    console.log('⚠️ Network connectivity check timed out');
                    return false;
                } else {
                    throw fetchError;
                }
            }
        } catch (error) {
            console.error('❌ Network connectivity check failed:', error);
            
            // Fallback: assume network is available
            console.log('🔄 Assuming network is available (fallback)');
            return true;
        }
    };

// ...existing code...
    // BƯỚC 4: Khởi tạo Agora client với retry logic
    const initAgora = async (channelName, appId = APP_ID, retryCount = 0) => {
        if (isInitializedRef.current) {
            console.log('⚠️ Agora already initialized, skipping...');
            return;
        }
        
        try {
            console.log('🎯 Initializing Agora with:', { channelName, appId, attempt: retryCount + 1 });
            console.log('🔍 CRITICAL: Channel name being used:', channelName);
            console.log('🔍 CRITICAL: Channel name length:', channelName.length);
            console.log('🔍 CRITICAL: Appointment ID:', appointment?.id);

            // Skip network check to avoid CORS issues
            console.log('⚡ Skipping network check (CORS prevention)');

            // Enhanced channel name validation
            if (!channelName) {
                throw new Error('Channel name is required');
            }
            
            if (channelName.length > 64) {
                console.log('⚠️ Channel name too long, creating fallback...');
                const fallbackName = createShortChannelName(appointment?.id || Date.now());
                console.log('🔄 Using fallback channel name:', fallbackName);
                channelName = fallbackName;
            }
            
            const validChannelRegex = /^[a-zA-Z0-9\-_]+$/;
            if (!validChannelRegex.test(channelName)) {
                console.log('⚠️ Channel name contains invalid characters, creating safe name...');
                const safeName = channelName.replace(/[^a-zA-Z0-9\-_]/g, '_');
                console.log('🔄 Using safe channel name:', safeName);
                channelName = safeName;
            }

            console.log('✅ Final channel name validation passed:', channelName, 'Length:', channelName.length);
            console.log('🚨 BOTH USERS MUST JOIN THE SAME CHANNEL:', channelName);

            isInitializedRef.current = true;

            // FIXED: Create client with minimal configuration
            const client = AgoraRTC.createClient({ 
                mode: 'rtc', 
                codec: 'vp8'
            });
            clientRef.current = client;

            // Add event handlers
            client.on('user-published', handleUserPublished);
            client.on('user-unpublished', handleUserUnpublished);
            client.on('connection-state-change', handleConnectionStateChange);
            
            // Add more event handlers for debugging
            client.on('user-joined', (user) => {
                console.log('👋 User joined:', user.uid);
                console.log('🎉 REMOTE USER DETECTED! Connection should be established soon...');
            });
            
            client.on('user-left', (user) => {
                console.log('👋 User left:', user.uid);
            });

            // Enhanced error handling
            client.on('network-quality', (stats) => {
                console.log('📊 Network quality update:', stats);
            });

            client.on('exception', (evt) => {
                console.error('❌ Agora exception:', evt);
            });

            // Join with better error handling
            let uid;
            try {
                console.log('🔄 Attempting to join channel:', channelName);
                const joinPromise = client.join(appId, channelName, token || null, null);
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000);
                });

                uid = await Promise.race([joinPromise, timeoutPromise]);
                console.log('✅ Joined Agora channel with UID:', uid);
                console.log('🎯 Successfully joined channel:', channelName);
            } catch (joinError) {
                console.error('❌ Failed to join channel:', joinError);
                throw joinError;
            }

            // Create and publish tracks
            let audioTrack, videoTrack;
            
            try {
                console.log('🎥 Creating camera and microphone tracks...');
                [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
                    {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    },
                    {
                        encoderConfig: {
                            width: 640,
                            height: 480,
                            frameRate: 15,
                            bitrateMax: 1000
                        },
                        optimizationMode: 'motion'
                    }
                );
                console.log('✅ Created tracks successfully');
            } catch (trackError) {
                console.error('❌ Error creating tracks:', trackError);
                
                // Fallback
                try {
                    [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                    console.log('✅ Created tracks with basic settings');
                } catch (fallbackError) {
                    throw new Error('Failed to create media tracks');
                }
            }

            // Store tracks
            localTracksRef.current = { audio: audioTrack, video: videoTrack };

            // Play local video
            if (localVideoRef.current && videoTrack) {
                try {
                    videoTrack.play(localVideoRef.current);
                    console.log('✅ Playing local video successfully');
                } catch (localPlayError) {
                    console.error('❌ Error playing local video:', localPlayError);
                }
            }

            // Publish tracks
            try {
                console.log('📡 Publishing local tracks...');
                await client.publish([audioTrack, videoTrack]);
                console.log('✅ Published local tracks successfully');
                console.log('🎯 Other users should now be able to see/hear you');
                
                // Set initial states
                setMicOn(true);
                setCameraOn(true);
                
            } catch (publishError) {
                console.error('❌ Error publishing tracks:', publishError);
            }
            
            console.log('🎉 Agora initialization completed successfully');
            console.log('🔍 Waiting for remote users to join channel:', channelName);
            
        } catch (error) {
            console.error('❌ Error initializing Agora:', error);
            isInitializedRef.current = false;
            throw error;
        }
    };
// ...existing code...
    // BƯỚC 5: Enhanced cleanup with better error handling
    const cleanup = async () => {
        try {
            isInitializedRef.current = false;
            
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // Stop and close tracks
            if (localTracksRef.current.audio) {
                try {
                    localTracksRef.current.audio.stop();
                    localTracksRef.current.audio.close();
                } catch (error) {
                    console.log('⚠️ Error stopping audio track:', error);
                }
            }
            
            if (localTracksRef.current.video) {
                try {
                    localTracksRef.current.video.stop();
                    localTracksRef.current.video.close();
                } catch (error) {
                    console.log('⚠️ Error stopping video track:', error);
                }
            }

            // Leave channel and cleanup client
            if (clientRef.current) {
                try {
                    await clientRef.current.leave();
                    clientRef.current.removeAllListeners();
                    clientRef.current = null;
                } catch (error) {
                    console.log('⚠️ Error during client cleanup:', error);
                }
            }

            // Clear remote users
            remoteUsersRef.current = {};
            setIsConnected(false);
            setConnectionState('DISCONNECTED');

            console.log('🧹 Cleanup completed');
        } catch (error) {
            console.error('❌ Error during cleanup:', error);
        }
    };

    // BƯỚC 6: Kết thúc cuộc gọi và gọi API để đánh dấu kết thúc
    const endCall = async () => {
        console.log('🔚 Ending video call...');
        console.log('📊 Call duration:', callDuration, 'seconds');
        console.log('⏰ Call started at:', callStartTime?.toLocaleTimeString());

        const endTime = new Date();
        console.log('⏰ Call ended at:', endTime.toLocaleTimeString());
        // Cleanup Agora
        await cleanup();

        // Nếu có callId từ API, gọi API end call
        if (callId) {
            try {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                console.log('🔄 Attempting to end call via API:', callId, 'for user:', currentUser.id);

                // Check if call is already ended by fetching current status first
                try {
                    const callDetailsResponse = await api.get(`/api/video-calls/${callId}`);
                    const currentCallStatus = callDetailsResponse.data?.status;
                    
                    console.log('🔍 Current call status before ending:', currentCallStatus);
                    
                    if (currentCallStatus === 'ENDED' || currentCallStatus === 'CANCELLED') {
                        console.log('ℹ️ Call is already ended, skipping API call');
                } else {
                    // Prepare request body with required fields
                    const endCallPayload = {
                        endedAt: endTime.toISOString(),
                        durationSeconds: Math.max(0, callDuration)
                    };

                    console.log('📝 Sending end call payload:', endCallPayload);

                    // Use exact Swagger API format with both query param and request body
                    const response = await api.post(`/api/video-calls/${callId}/end?userId=${currentUser.id}`, endCallPayload);
                    console.log('✅ Call ended via API successfully:', response.data);
                    }
                } catch (statusError) {
                    console.log('⚠️ Could not check call status, proceeding with end call:', statusError);
                    
                    // Try to end call anyway
                    try {
                        const endCallPayload = {
                            endedAt: endTime.toISOString(),
                            durationSeconds: Math.max(0, callDuration)
                        };

                        const response = await api.post(`/api/video-calls/${callId}/end?userId=${currentUser.id}`, endCallPayload);
                        console.log('✅ Call ended via API successfully:', response.data);
                    } catch (endError) {
                        console.log('⚠️ Failed to end call via API:', endError);
                    }
                }
                
            } catch (error) {
                const errorStatus = error.response?.status;
                
                console.log('⚠️ Error ending call via API (this is expected if call was already ended):', {
                    status: errorStatus,
                    callId: callId,
                    message: 'Ignoring error - call cleanup completed successfully'
                });
            }
        }

        // Always callback về parent component với dữ liệu để parent tự xử lý
        onCallEnd?.({
            appointmentId: appointment.id,
            duration: callDuration,
            startTime: callStartTime,
            endTime: endTime,
            consultantId: consultantInfo.id,
            customerId: customerInfo.id,
            isConsultant,
            callId
        });
    };

    // Display helpers
    const getDisplayName = () => {
        return opponentInfo?.name || (isConsultant ? 'Khách hàng' : 'Tư vấn viên');
    };

    const getCallDurationDisplay = () => {
        const minutes = Math.floor(callDuration / 60);
        const seconds = callDuration % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const displayName = getDisplayName();

    // ADD: Debug effect to monitor video elements
    useEffect(() => {
        const checkVideoElements = () => {
            console.log('🔍 Video Element Check:');
            console.log('- Local video ref:', !!localVideoRef.current);
            console.log('- Remote video ref:', !!remoteVideoRef.current);
            console.log('- Local video children:', localVideoRef.current?.children.length || 0);
            console.log('- Remote video children:', remoteVideoRef.current?.children.length || 0);
            console.log('- Remote users:', Object.keys(remoteUsersRef.current));
            console.log('- Is connected:', isConnected);
            console.log('- Connection state:', connectionState);
            console.log('- Local tracks:', {
                audio: !!localTracksRef.current?.audio,
                video: !!localTracksRef.current?.video
            });
            
            // Check if remote video has actual video content
            if (remoteVideoRef.current) {
                const videoElements = remoteVideoRef.current.querySelectorAll('video');
                console.log('- Remote video elements found:', videoElements.length);
                videoElements.forEach((video, index) => {
                    console.log(`  Video ${index}: ${video.videoWidth}x${video.videoHeight}, ready: ${video.readyState}`);
                });
            }
        };
        
        const debugInterval = setInterval(checkVideoElements, 5000);
        return () => clearInterval(debugInterval);
    }, []);
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
                                ? `Thời gian: ${getCallDurationDisplay()}` 
                                : connectionState === 'CONNECTING' ? 'Đang kết nối...' : 'Chờ kết nối...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                        isConnected ? 'bg-green-600' : 
                        connectionState === 'CONNECTING' ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                        {connectionState === 'CONNECTING' && (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {isConnected ? 'Đã kết nối' : 
                         connectionState === 'CONNECTING' ? 'Đang kết nối' : 'Chờ kết nối'}
                    </div>
                    <div className="text-xs text-gray-400">
                        {callId ? `Call ID: ${callId}` : 'Direct Call'}
                    </div>
                    <div className="text-xs text-gray-400">
                        Remote users: {Object.keys(remoteUsersRef.current).length}
                    </div>
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
                                overflow: 'hidden',
                                backgroundColor: '#111827'
                            }}
                        />
                        {!isConnected && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                    {connectionState === 'CONNECTING' ? (
                                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Users size={40} />
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{displayName}</h3>
                                <p className="text-gray-300 mb-2">
                                    {connectionState === 'CONNECTING' ? 'Đang kết nối...' : 'Chờ người dùng tham gia'}
                                </p>
                                <p className="text-sm text-gray-400">
                                    Remote users: {Object.keys(remoteUsersRef.current).length}
                                </p>
                                {connectionState === 'CONNECTING' && (
                                    <div className="mt-4 text-center">
                                        <div className="text-xs text-gray-400">
                                            Đang thiết lập kết nối WebSocket...
                                        </div>
                                    </div>
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
                        {currentUserName}
                    </div>
                </div>

                {/* Participant info */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <User size={16} />
                        {isConsultant ? 'Thông tin khách hàng' : 'Thông tin tư vấn viên'}
                    </h4>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">📝 Tên: {displayName}</p>
                        {opponentInfo?.phone && (
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
                        {isConnected && (
                            <p className="text-sm">🕐 Thời gian: {getCallDurationDisplay()}</p>
                        )}
                        {callStartTime && (
                            <p className="text-xs text-gray-300 mt-2">
                                Bắt đầu: {callStartTime.toLocaleTimeString()}
                            </p>
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