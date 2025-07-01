import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Monitor, Users } from 'lucide-react';
import api from '../../config/axios';
import { getDatabase, ref, set, onValue, push, remove, off } from "firebase/database";
import { getApp } from "firebase/app";

const VideoCall = ({
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

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const timerRef = useRef(null);
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    const isUnmounted = useRef(false);
    // Firebase setup
    const db = getDatabase(getApp("videoCallApp"));
    const signalingRef = ref(db, `webrtc/${appointment.id}`);

    // Lấy thông tin đối phương
    useEffect(() => {
        const fetchOpponent = async () => {
            if (isConsultant) {
                const customers = await api.get('/api/activecustomers');
                const customer = customers.data.find(u => u.id === appointment.customerId);
                setOpponentInfo(customer);
            } else {
                const consultants = await api.get('/api/activeconsultants');
                const consultant = consultants.data.find(u => u.id === appointment.consultantId);
                setOpponentInfo(consultant);
            }
        };
        fetchOpponent();
    }, [isConsultant, appointment]);

    // WebRTC logic
    useEffect(() => {
        isUnmounted.current = false;
        let pc;
        let localStream;
        let remoteStream = new MediaStream();
    const setup = async () => {
        pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        pcRef.current = pc;

        // Get local stream
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (isUnmounted) {
            // Nếu đã unmount thì dừng stream và return
            localStream.getTracks().forEach(track => track.stop());
            return;
        }
        localStreamRef.current = localStream;
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
        localStream.getTracks().forEach(track => {
            if (pc.signalingState !== "closed") {
                pc.addTrack(track, localStream);
            }
        });

        // Handle remote stream
        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => {
                remoteStream.addTrack(track);
            });
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
            setIsConnected(true);
        };

        // ICE candidate
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                push(ref(db, `webrtc/${appointment.id}/candidates_${isConsultant ? 'consultant' : 'customer'}`), event.candidate.toJSON());
            }
        };

        // Signaling logic
        if (isConsultant) {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            await set(ref(db, `webrtc/${appointment.id}/offer`), offer);

            onValue(ref(db, `webrtc/${appointment.id}/answer`), async (snapshot) => {
                const answer = snapshot.val();
                if (answer && !pc.currentRemoteDescription) {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                }
            });
        } else {
            onValue(ref(db, `webrtc/${appointment.id}/offer`), async (snapshot) => {
                const offer = snapshot.val();
                if (offer && !pc.currentRemoteDescription) {
                    await pc.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    await set(ref(db, `webrtc/${appointment.id}/answer`), answer);
                }
            });
        }

        // Lắng nghe ICE candidate từ phía đối phương
        const candidateRef = ref(db, `webrtc/${appointment.id}/candidates_${isConsultant ? 'customer' : 'consultant'}`);
        onValue(candidateRef, (snapshot) => {
            const candidates = snapshot.val();
            if (candidates) {
                Object.values(candidates).forEach(async (candidate) => {
                    try {
                        if (pc.signalingState !== "closed") {
                            await pc.addIceCandidate(new RTCIceCandidate(candidate));
                        }
                    } catch (e) {}
                });
            }
        });
    };

    setup();

    // Cleanup
    return () => {
        isUnmounted.current = true;
        if (pcRef.current) {
            pcRef.current.close();
        }
        off(signalingRef);
        remove(ref(db, `webrtc/${appointment.id}`));
    };
}, [isConsultant, appointment, db, signalingRef]);

    // Call timer
    useEffect(() => {
        if (isConnected) {
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isConnected]);

    // Toggle microphone
    const toggleMic = () => {
        setMicOn(m => {
            localStreamRef.current?.getAudioTracks().forEach(track => (track.enabled = !m));
            return !m;
        });
    };

    // Toggle camera
    const toggleCamera = () => {
        setCameraOn(c => {
            localStreamRef.current?.getVideoTracks().forEach(track => (track.enabled = !c));
            return !c;
        });
    };

    // End call
    const endCall = () => {
        onCallEnd?.(callDuration);
    };

    // Hiển thị tên đối phương
    const displayName = opponentInfo?.name || (isConsultant ? 'Khách hàng' : 'Tư vấn viên');

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
                                : `Tư vấn với ${displayName}`}
                        </h3>
                        <p className="text-sm text-gray-300">
                            {isConnected ? `Thời gian: ${String(Math.floor(callDuration/60)).padStart(2,'0')}:{String(callDuration%60).padStart(2,'0')}` : 'Đang kết nối...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-sm ${
                        isConnected ? 'bg-green-600' : 'bg-yellow-600'
                    }`}>
                        {isConnected ? 'Đã kết nối' : 'Đang kết nối'}
                    </div>
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative">
                {/* Main video area */}
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="relative w-[480px] h-[360px] bg-black rounded-xl flex items-center justify-center">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                background: '#000',
                                borderRadius: '1rem'
                            }}
                        />
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <h3 className="text-xl font-semibold mb-2 text-white">
                                {displayName}
                            </h3>
                            <p className="text-gray-300">Đang trong cuộc gọi video</p>
                        </div>
                    </div>
                </div>

                {/* Local video (picture in picture) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden border-2 border-white">
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        {cameraOn ? (
                            <div className="text-center text-white">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        muted
                                        playsInline
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            background: '#000',
                                            borderRadius: '1rem'
                                        }}
                                    />
                                </div>
                                <p className="text-xs">Bạn</p>
                            </div>
                        ) : (
                            <div className="text-white text-center">
                                <VideoOff size={24} className="mx-auto mb-2" />
                                <p className="text-sm">Camera tắt</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Thông tin đối phương */}
                {opponentInfo && (
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">
                            {isConsultant ? 'Thông tin khách hàng' : 'Thông tin tư vấn viên'}
                        </h4>
                        <p className="text-sm">Tên: {opponentInfo.name}</p>
                        {opponentInfo.phone && (
                            <p className="text-sm">SĐT: {opponentInfo.phone}</p>
                        )}
                        {opponentInfo.email && (
                            <p className="text-sm">Email: {opponentInfo.email}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Control Bar */}
            <div className="bg-gray-900 p-4">
                <div className="flex justify-center items-center space-x-4">
                    {/* Microphone toggle */}
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

                    {/* Camera toggle */}
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

                    {/* End call */}
                    <button
                        onClick={endCall}
                        className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                        title="Kết thúc cuộc gọi"
                    >
                        <PhoneOff size={20} />
                    </button>

                    {/* Screen share (future feature) */}
                    <button
                        className="p-3 bg-gray-600 hover:bg-gray-500 text-white rounded-full transition-colors opacity-50 cursor-not-allowed"
                        title="Chia sẻ màn hình (sắp ra mắt)"
                        disabled
                    >
                        <Monitor size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;