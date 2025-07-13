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
    const [isPolling, setIsPolling] = useState(false);
    const pollingIntervalRef = useRef(null);

    // PRIMARY: Super short channel name using just appointment ID
    const createShortChannelName = (appointmentId) => {
        const shortName = `apt_${appointmentId}`;
        console.log('📺 Generated short channel name:', shortName, 'Length:', shortName.length);
        return shortName;
    };

    // NEW: Function to shorten long channel names from API
    const shortenChannelName = (longChannelName) => {
        if (!longChannelName || longChannelName.length <= 64) {
            return longChannelName;
        }
        
        const parts = longChannelName.split('_');
        
        if (parts.length >= 2) {
            const firstPart = parts[0];
            const lastPart = parts[parts.length - 1];
            const shortened = `${firstPart}_${lastPart}`;
            
            if (shortened.length <= 64) {
                console.log('✂️ Shortened channel name:', shortened, 'Length:', shortened.length);
                return shortened;
            }
        }
        
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

    // Helper function to check call status
    const checkCallStatus = async (callId) => {
        try {
            console.log('🔍 Checking call status for callId:', callId);
            const response = await api.get(`/api/video-calls/${callId}`);
            console.log('📊 Call status response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error checking call status:', error);
            return null;
        }
    };

    // Function to find available call for this appointment
    const findAvailableCall = async () => {
        try {
            console.log('🔍 Looking for available calls...');
            console.log('🔍 Current user info:', { consultantInfo, customerInfo, appointment });
            
            const response = await api.get('/api/video-calls/videcalls');
            console.log('📊 All calls from API:', response.data);
            
            if (response.data && Array.isArray(response.data)) {
                console.log('📋 Total calls found:', response.data.length);
                
                // Log each call for debugging
                response.data.forEach((call, index) => {
                    console.log(`📞 Call ${index}:`, {
                        id: call.id,
                        status: call.status,
                        channelName: call.channelName,
                        consultantId: call.consultantId?.id,
                        customerId: call.customerId?.id,
                        createdAt: call.createdAt
                    });
                });
                
                // Enhanced filtering logic
                const availableCall = response.data.find(call => {
                    const matchesStatus = call.status === 'INITIATED';
                    const matchesConsultant = call.consultantId?.id === consultantInfo.id;
                    const matchesCustomer = call.customerId?.id === customerInfo.id;
                    const hasChannelName = call.channelName && call.channelName.length > 0;
                    const matchesAppointment = call.channelName && call.channelName.includes(appointment.id.toString());
                    
                    console.log('🔍 Call matching check:', {
                        callId: call.id,
                        matchesStatus,
                        matchesConsultant,
                        matchesCustomer,
                        hasChannelName,
                        matchesAppointment,
                        isMatch: matchesStatus && (matchesConsultant || matchesCustomer) && hasChannelName
                    });
                    
                    return matchesStatus && (matchesConsultant || matchesCustomer) && hasChannelName;
                });
                
                if (availableCall) {
                    console.log('✅ Found available call:', availableCall);
                    return availableCall;
                } else {
                    console.log('⚠️ No matching calls found');
                    
                    // Show what we're looking for
                    console.log('🎯 Looking for call with:', {
                        status: 'INITIATED',
                        consultantId: consultantInfo.id,
                        customerId: customerInfo.id,
                        appointmentId: appointment.id
                    });
                }
            } else {
                console.log('⚠️ No calls data or invalid format');
            }
            
            return null;
        } catch (error) {
            console.error('❌ Error finding available calls:', error);
            if (error.response) {
                console.error('❌ API Error Details:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            return null;
        }
    };
    const createConsultantCall = async () => {
        try {
            console.log('👨‍💼 CONSULTANT: Initiating new video call via API...');
            
            const consultantId = consultantInfo.id;
            const customerId = customerInfo.id;

            // Validate IDs
            if (!consultantId || consultantId === 'undefined' || consultantId === 'null') {
                throw new Error(`Invalid consultantId: "${consultantId}"`);
            }

            if (!customerId || customerId === 'undefined' || customerId === 'null') {
                throw new Error(`Invalid customerId: "${customerId}"`);
            }

            console.log('🔍 Validated IDs:', { consultantId, customerId });

            const payload = {
                consultantId: String(consultantId).trim(),
                customerId: String(customerId).trim(),
                callType: "video"
            };

            console.log('📝 Sending API payload:', payload);
            
            // Make the API call
            const response = await api.post('/api/video-calls/initiate', payload);
            console.log('✅ Video call initiated successfully:', response.data);
            
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

            // Verify the call was created by checking the database
            console.log('🔍 Verifying call was created in database...');
            setTimeout(async () => {
                try {
                    const verificationResponse = await api.get('/api/video-calls/videcalls');
                    const createdCall = verificationResponse.data.find(call => call.id === newCallId);
                    if (createdCall) {
                        console.log('✅ Call verified in database:', createdCall);
                    } else {
                        console.error('❌ Call not found in database after creation');
                    }
                } catch (verifyError) {
                    console.error('❌ Error verifying call:', verifyError);
                }
            }, 1000);
        
            if (status === "INITIATED" || status === "RINGING" || status === "ACTIVE") {
                const callIdString = typeof newCallId === 'bigint'
                    ? newCallId.toString()
                    : String(newCallId);

                setCallId(callIdString);
                console.log(`✅ CONSULTANT: Call ID created and saved: ${callIdString}`);
                
                // Use API channel name if provided, otherwise use shared name
                const SHARED_CHANNEL_NAME = createShortChannelName(appointment.id);
                const finalChannelName = apiChannelName && apiChannelName.trim() 
                    ? shortenChannelName(apiChannelName.trim())
                    : SHARED_CHANNEL_NAME;
                
                // Save call information
                localStorage.setItem(`activeCallId_${appointment.id}`, callIdString);
                localStorage.setItem(`channelName_${appointment.id}`, finalChannelName);
                console.log('💾 Saved call info - ID:', callIdString, 'Channel:', finalChannelName);

                // Auto-accept the call as consultant
                if (status === "INITIATED") {
                    try {
                        await acceptCall(callIdString);
                        console.log('✅ Consultant auto-accepted call');
                    } catch (acceptError) {
                        console.warn('⚠️ Consultant failed to auto-accept call:', acceptError);
                    }
                }

                const startTime = new Date();
                setCallStartTime(startTime);
                console.log('⏰ Call started at:', startTime.toLocaleTimeString());

                // Initialize Agora
                const finalAppId = appId && appId.trim() ? appId.trim() : APP_ID;
                isInitializedRef.current = false;
                await initAgora(finalChannelName, finalAppId);
                
                return true;
            } else {
                throw new Error(`Call initiation failed with unexpected status: ${status}`);
            }
        } catch (error) {
            console.error('❌ Error creating consultant call:', error);
            if (error.response) {
                console.error('❌ API Error Details:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
            }
            throw error;
        }
    };
    // Accept call function
    const acceptCall = async (callId) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!currentUser || !currentUser.id) {
                console.error('❌ No valid user found in localStorage');
                return null;
            }

            // Check if the call status is INITIATED
            const callStatus = await checkCallStatus(callId);
            if (!callStatus) {
                console.error('❌ Could not retrieve call status');
                return null;
            }

            if (callStatus.status !== 'INITIATED') {
                console.warn('⚠️ Call status is not INITIATED, current status:', callStatus.status);
                if (callStatus.status === 'ACTIVE') {
                    console.log('✅ Call is already active, proceeding...');
                    return callStatus;
                } else {
                    console.error('❌ Cannot accept call with status:', callStatus.status);
                    return null;
                }
            }
            
            console.log('📞 Accepting call via API:', callId, 'for user:', currentUser.id);
            
            const response = await api.post(`/api/video-calls/${callId}/accept?userId=${currentUser.id}`);
            console.log('✅ Call accepted via API:', response.data);
            
            // Verify the call is now active
            const updatedStatus = await checkCallStatus(callId);
            if (updatedStatus) {
                console.log('📋 Call status after accept:', updatedStatus.status);
                if (updatedStatus.startedAt) {
                    console.log('⏰ Call started at (from API):', new Date(updatedStatus.startedAt));
                }
            }
            
            return response.data;
        } catch (error) {
            console.error('❌ Error accepting call via API:', error);
            if (error.response) {
                console.error('❌ Accept API Error Details:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
            }
            return null;
        }
    };

    // Stop polling function
    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            setIsPolling(false);
            console.log('⏹️ Stopped polling for calls');
        }
    };


    // Enhanced polling with better retry logic
    const startPollingForCall = () => {
        if (isConsultant || isPolling) return;
        
        console.log('🔄 Customer: Starting to poll for initiated calls...');
        setIsPolling(true);
        
        let pollCount = 0;
        const maxPolls = 30; // 30 polls x 2 seconds = 60 seconds max
        
        pollingIntervalRef.current = setInterval(async () => {
            pollCount++;
            console.log(`🔄 Customer: Polling attempt ${pollCount}/${maxPolls}`);
            
            try {
                const availableCall = await findAvailableCall();
                
                if (availableCall) {
                    console.log('🎉 Customer: Found consultant\'s call!', availableCall);
                    
                    // Stop polling
                    clearInterval(pollingIntervalRef.current);
                    setIsPolling(false);
                    
                    // Join the consultant's call (DO NOT CREATE NEW CALL)
                    await joinExistingCall(availableCall.id.toString(), availableCall.channelName);
                    
                    return; // Exit the polling
                }

                // Check localStorage again (in case consultant created call while polling)
                const callId = localStorage.getItem(`activeCallId_${appointment.id}`);
                const channelName = localStorage.getItem(`channelName_${appointment.id}`);
                
                if (callId && channelName) {
                    console.log('🎉 Customer: Found call in localStorage during polling!');
                    
                    // Stop polling
                    clearInterval(pollingIntervalRef.current);
                    setIsPolling(false);
                    
                    // Join the consultant's call (DO NOT CREATE NEW CALL)
                    await joinExistingCall(callId, channelName);
                    
                    return; // Exit the polling
                }
                
                // If we've polled too many times, stop
                if (pollCount >= maxPolls) {
                    console.log('⏰ Customer: Polling timeout, stopping...');
                    clearInterval(pollingIntervalRef.current);
                    setIsPolling(false);
                    
                    // Try fallback connection
                    console.log('🔄 Customer: Attempting fallback connection...');
                    const fallbackChannelName = createShortChannelName(appointment.id);
                    const startTime = new Date();
                    setCallStartTime(startTime);
                    
                    isInitializedRef.current = false;
                    await initAgora(fallbackChannelName, APP_ID);
                }
            } catch (error) {
                console.error('❌ Error during polling:', error);
                pollCount--; // Don't count failed polls
            }
        }, 2000); // Poll every 2 seconds
    };
    const joinExistingCall = async (callId, channelName) => {
        try {
            console.log('👤 CUSTOMER: Joining existing call:', { callId, channelName });
            
            setCallId(callId);
            
            // 📞 Customer accepts the call
            const acceptResult = await acceptCall(callId);
            if (acceptResult) {
                console.log('✅ Customer accepted call successfully');
            } else {
                console.warn('⚠️ Customer failed to accept call, but continuing...');
            }
            
            // Start the call
            const startTime = new Date();
            setCallStartTime(startTime);
            console.log('⏰ Customer call started at:', startTime.toLocaleTimeString());
            
            // Initialize Agora with the same channel name as consultant
            isInitializedRef.current = false;
            await initAgora(channelName, APP_ID);
            
            console.log('✅ Customer: Successfully joined consultant\'s call');
        } catch (error) {
            console.error('❌ Error joining existing call:', error);
            throw error;
        }
    };
    // Add missing helper function:
    const getCallDurationDisplay = () => {
        const minutes = Math.floor(callDuration / 60);
        const seconds = callDuration % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    // Updated initialization logic
    useEffect(() => {
        const initiateVideoCall = async () => {
            if (isInitializedRef.current || !appointment?.id || !consultantInfo?.id || !customerInfo?.id) {
                console.log('⚠️ Call initialization delayed: Waiting for complete appointment data...', {
                    initialized: isInitializedRef.current,
                    appointmentId: appointment?.id,
                    consultantId: consultantInfo?.id,
                    customerId: customerInfo?.id,
                    isConsultant: isConsultant
                });
                return;
            }

            try {
                if (isConsultant) {
                    // 👨‍💼 CONSULTANT: Use the existing createConsultantCall function
                    await createConsultantCall();
                } else {
                    // 👤 CUSTOMER: Finds consultant's call and joins it
                    console.log('👤 CUSTOMER: Looking for consultant\'s call...');
                    
                    // First, try to find call from localStorage
                    let existingCallId = localStorage.getItem(`activeCallId_${appointment.id}`);
                    let existingChannelName = localStorage.getItem(`channelName_${appointment.id}`);
                    
                    if (existingCallId && existingChannelName) {
                        console.log('✅ CUSTOMER: Found call in localStorage:', {
                            callId: existingCallId,
                            channelName: existingChannelName
                        });
                        
                        // Join the existing call
                        await joinExistingCall(existingCallId, existingChannelName);
                    } else {
                        // If not found in localStorage, poll the API
                        console.log('🔄 CUSTOMER: No call found in localStorage, polling API...');
                        startPollingForCall();
                    }
                }
            } catch (error) {
                console.error('❌ Error in video call initialization:', error);
                
                // Fallback initialization
                console.log('🔄 Attempting fallback initialization...');
                try {
                    const fallbackChannelName = createShortChannelName(appointment.id);
                    const startTime = new Date();
                    setCallStartTime(startTime);

                    isInitializedRef.current = false;
                    await initAgora(fallbackChannelName, APP_ID);
                    console.log('✅ Fallback initialization successful');
                } catch (fallbackError) {
                    console.error('❌ Fallback initialization failed:', fallbackError);
                    alert(`Lỗi khởi tạo cuộc gọi: ${error.message}`);
                    onCallEnd?.();
                }
            }
        };

        const timeoutId = setTimeout(initiateVideoCall, 2000);

        return () => {
            clearTimeout(timeoutId);
            stopPolling();
        };

    }, [appointment, consultantInfo, customerInfo, channelName, isConsultant]);
    // Cleanup effect
    useEffect(() => {
        return () => {
            stopPolling();
            if (appointment?.id && isConsultant) {
                try {
                    localStorage.removeItem(`activeCallId_${appointment.id}`);
                    localStorage.removeItem(`channelName_${appointment.id}`);
                    console.log('🧹 Cleaned up localStorage');
                } catch (storageError) {
                    console.error('❌ Failed to cleanup localStorage:', storageError);
                }
            }
            cleanup();
        };
    }, [appointment?.id, isConsultant]);

    // Event handlers for remote users
    const handleUserPublished = async (user, mediaType) => {
        console.log('👤 User published:', user.uid, 'Media type:', mediaType);
        try {
            await clientRef.current.subscribe(user, mediaType);
            console.log('✅ Subscribed to user:', user.uid, mediaType);

            if (mediaType === 'video') {
                console.log('🎥 Processing video track...');
                if (remoteVideoRef.current) {
                    try {
                        console.log('▶️ Attempting to play remote video...');
                        user.videoTrack.play(remoteVideoRef.current);
                        console.log('✅ Playing remote video successfully');
                        setIsConnected(true);
                    } catch (playError) {
                        console.error('❌ Error playing remote video:', playError);
                        
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
                }
            }
            
            if (mediaType === 'audio') {
                console.log('🔊 Processing audio track...');
                try {
                    user.audioTrack.play();
                    console.log('▶️ Playing remote audio successfully');
                } catch (audioError) {
                    console.error('❌ Error playing remote audio:', audioError);
                }
            }

            remoteUsersRef.current[user.uid] = user;
            console.log('📊 Remote users count:', Object.keys(remoteUsersRef.current).length);
        } catch (subscribeError) {
            console.error('❌ Error subscribing to user:', subscribeError);
        }
    };

    const handleUserUnpublished = (user, mediaType) => {
        console.log('👤 User unpublished:', user.uid, 'Media type:', mediaType);
        
        if (mediaType === 'video') {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.innerHTML = '';
                console.log('🧹 Cleared remote video display');
            }
        }
        
        if (!user.videoTrack && !user.audioTrack) {
            delete remoteUsersRef.current[user.uid];
            console.log('🗑️ Removed remote user:', user.uid);
            
            if (Object.keys(remoteUsersRef.current).length === 0) {
                setIsConnected(false);
                console.log('⚠️ No more remote users, disconnected');
            }
        }
    };
    
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

    // BƯỚC 4: Khởi tạo Agora client
    const initAgora = async (channelName, appId = APP_ID) => {
        if (isInitializedRef.current) {
            console.log('⚠️ Agora already initialized, skipping...');
            return;
        }
        
        try {
            console.log('🎯 Initializing Agora with:', { channelName, appId });
            console.log('🔍 CRITICAL: Channel name being used:', channelName);
            console.log('🔍 CRITICAL: Channel name length:', channelName.length);

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

            const client = AgoraRTC.createClient({ 
                mode: 'rtc', 
                codec: 'vp8'
            });
            clientRef.current = client;

            // Add event handlers
            client.on('user-published', handleUserPublished);
            client.on('user-unpublished', handleUserUnpublished);
            client.on('connection-state-change', handleConnectionStateChange);
            
            client.on('user-joined', (user) => {
                console.log('👋 User joined:', user.uid);
                console.log('🎉 REMOTE USER DETECTED! Connection should be established soon...');
            });
            
            client.on('user-left', (user) => {
                console.log('👋 User left:', user.uid);
            });

            client.on('network-quality', (stats) => {
                console.log('📊 Network quality update:', stats);
            });

            client.on('exception', (evt) => {
                console.error('❌ Agora exception:', evt);
            });

            // Join channel
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
                
                try {
                    [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                    console.log('✅ Created tracks with basic settings');
                } catch (fallbackError) {
                    throw new Error('Failed to create media tracks');
                }
            }

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

    // BƯỚC 5: Cleanup
    const cleanup = async () => {
        try {
            isInitializedRef.current = false;
            
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

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

            if (clientRef.current) {
                try {
                    await clientRef.current.leave();
                    clientRef.current.removeAllListeners();
                    clientRef.current = null;
                } catch (error) {
                    console.log('⚠️ Error during client cleanup:', error);
                }
            }

            remoteUsersRef.current = {};
            setIsConnected(false);
            setConnectionState('DISCONNECTED');

            console.log('🧹 Cleanup completed');
        } catch (error) {
            console.error('❌ Error during cleanup:', error);
        }
    };

    // BƯỚC 6: End call
    const endCall = async () => {
        console.log('🔚 Ending video call...');
        
        // Stop polling if active
        stopPolling();
        
        const endTime = new Date();
        const actualDuration = callStartTime ? Math.floor((endTime - callStartTime) / 1000) : callDuration;
        
        await cleanup();

        if (callId) {
            try {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                console.log('🔄 Attempting to end call via API:', callId);

                const response = await api.post(`/api/video-calls/${callId}/end?userId=${currentUser.id}`);
                console.log('✅ Call ended via API:', response.data);
                
                // Verify call was ended
                const finalStatus = await checkCallStatus(callId);
                if (finalStatus) {
                    console.log('📋 Final call status:', finalStatus.status);
                    if (finalStatus.endedAt) {
                        console.log('⏰ Call ended at (from API):', new Date(finalStatus.endedAt));
                    }
                }
                
            } catch (error) {
                console.error('❌ Error ending call via API:', error);
            }
        }

        onCallEnd?.({
            appointmentId: appointment.id,
            duration: actualDuration,
            startTime: callStartTime,
            endTime: endTime,
            consultantId: consultantInfo.id,
            customerId: customerInfo.id,
            isConsultant,
            callId
        });
    };

    // FIX: Separate cleanup effect
    useEffect(() => {
        return () => {
            if (appointment?.id && isConsultant) {
                try {
                    localStorage.removeItem(`activeCallId_${appointment.id}`);
                    localStorage.removeItem(`channelName_${appointment.id}`);
                    console.log('🧹 Cleaned up localStorage');
                } catch (storageError) {
                    console.error('❌ Failed to cleanup localStorage:', storageError);
                }
            }
            
            cleanup();
        };
    }, [appointment?.id, isConsultant]);

    // Display helpers
    const getDisplayName = () => {
        return opponentInfo?.name || (isConsultant ? 'Khách hàng' : 'Tư vấn viên');
    };

    // Update your status display to include polling:
    const getConnectionStatusDisplay = () => {
        if (!isConsultant && isPolling) {
            return 'Đang tìm cuộc gọi...';
        }
        if (isConnected) {
            return `Thời gian: ${getCallDurationDisplay()}`;
        }
        if (connectionState === 'CONNECTING') {
            return 'Đang kết nối...';
        }
        return 'Chờ kết nối...';
    };

    const displayName = getDisplayName();

    // Debug effect
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
                            {getConnectionStatusDisplay()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
                        isConnected ? 'bg-green-600' : 
                        (isPolling || connectionState === 'CONNECTING') ? 'bg-yellow-600' : 'bg-red-600'
                    }`}>
                        {(isPolling || connectionState === 'CONNECTING') && (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {isConnected ? 'Đã kết nối' : 
                        isPolling ? 'Đang tìm cuộc gọi' :
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