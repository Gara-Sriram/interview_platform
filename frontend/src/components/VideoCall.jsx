import { useEffect, useRef, useState } from "react";
import socket from "../lib/socket";

// STUN servers — help browser discover its public IP for P2P connection
// Google's free STUN servers work for most networks
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export default function VideoCall({ roomId }) {
  const localVideoRef  = useRef(null);  // your own camera
  const remoteVideoRef = useRef(null);  // other person's camera
  const pcRef          = useRef(null);  // RTCPeerConnection instance
  const localStreamRef = useRef(null);  // local MediaStream

  const [camOn,  setCamOn]  = useState(false);
  const [micOn,  setMicOn]  = useState(false);
  const [hasRemote, setHasRemote] = useState(false);

  // ------------------------------------------------------------------
  // Start local camera + mic
  // ------------------------------------------------------------------
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setCamOn(true);
      setMicOn(true);
      return stream;
    } catch (err) {
      console.error("Camera access denied:", err);
      return null;
    }
  };

  // ------------------------------------------------------------------
  // Create RTCPeerConnection, attach local tracks, set up ICE handling
  // ------------------------------------------------------------------
  const createPeerConnection = (stream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    // Add local tracks to the connection
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // When we find a network path, send it to the other peer via Socket.IO
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("webrtc-ice-candidate", { roomId, candidate });
      }
    };

    // When we receive the remote video stream
    pc.ontrack = ({ streams }) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = streams[0];
        setHasRemote(true);
      }
    };

    return pc;
  };

  // ------------------------------------------------------------------
  // Main button: Turn on camera and start the call
  // ------------------------------------------------------------------
  const handleStartCall = async () => {
    const stream = await startMedia();
    if (!stream) return;

    const pc = createPeerConnection(stream);

    // Create and send offer to the other peer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("webrtc-offer", { roomId, offer });
  };

  // ------------------------------------------------------------------
  // Socket events for signaling
  // ------------------------------------------------------------------
  useEffect(() => {
    // We received an offer from the other peer — answer it
    socket.on("webrtc-offer", async ({ offer }) => {
      const stream = localStreamRef.current || await startMedia();
      if (!stream) return;

      const pc = createPeerConnection(stream);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtc-answer", { roomId, answer });
    });

    // We received an answer from the callee
    socket.on("webrtc-answer", async ({ answer }) => {
      await pcRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // We received an ICE candidate from the other peer
    socket.on("webrtc-ice-candidate", async ({ candidate }) => {
      try {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("ICE candidate error:", err);
      }
    });

    // Other peer left — clean up remote video
    socket.on("webrtc-peer-left", () => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      setHasRemote(false);
      pcRef.current?.close();
      pcRef.current = null;
    });

    return () => {
      socket.off("webrtc-offer");
      socket.off("webrtc-answer");
      socket.off("webrtc-ice-candidate");
      socket.off("webrtc-peer-left");
    };
  }, [roomId]);

  // Cleanup on unmount — stop camera, close connection
  useEffect(() => {
    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
    };
  }, []);

  // ------------------------------------------------------------------
  // Toggle camera / mic
  // ------------------------------------------------------------------
  const toggleCam = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) { track.enabled = !track.enabled; setCamOn(track.enabled); }
  };

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setMicOn(track.enabled); }
  };

  return (
    <div className="flex flex-col gap-2">

      {/* Remote video */}
      <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        {!hasRemote && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">
            Waiting for other user...
          </div>
        )}
        <span className="absolute bottom-1 left-2 text-xs text-white/60">Remote</span>
      </div>

      {/* Local video (small) */}
      <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted // mute local — no echo
          className="w-full h-full object-cover scale-x-[-1]" // mirror effect
        />
        {!camOn && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">
            Camera off
          </div>
        )}
        <span className="absolute bottom-1 left-2 text-xs text-white/60">You</span>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!camOn && !hasRemote ? (
          <button
            id="start-call-btn"
            onClick={handleStartCall}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-1.5 rounded-lg transition"
          >
            📹 Start Camera
          </button>
        ) : (
          <>
            <button
              id="toggle-cam-btn"
              onClick={toggleCam}
              className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition ${
                camOn
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-red-600/30 text-red-400 hover:bg-red-600/50"
              }`}
            >
              {camOn ? "📹 Cam On" : "📷 Cam Off"}
            </button>
            <button
              id="toggle-mic-btn"
              onClick={toggleMic}
              className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition ${
                micOn
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-red-600/30 text-red-400 hover:bg-red-600/50"
              }`}
            >
              {micOn ? "🎙️ Mic On" : "🔇 Mic Off"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
