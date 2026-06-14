import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

/**
 * useCodeSync — real-time collaborative code editor hook via Socket.io
 *
 * @param {object} options
 * @param {string}   options.sessionId          - MongoDB session _id (used as socket room)
 * @param {boolean}  options.isActive           - only connect when host or participant in an active session
 * @param {function} options.onRemoteCodeChange - called with new code string when peer edits
 * @param {function} options.onRemoteLangChange - called with { language, code } when peer changes language
 */
function useCodeSync({ sessionId, isActive, onRemoteCodeChange, onRemoteLangChange }) {
  const socketRef = useRef(null);
  // Prevents echoing remote changes back as local emits
  const suppressNextEmit = useRef(false);
  // Typing indicator debounce timer
  const typingTimer = useRef(null);

  const [peerConnected, setPeerConnected] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);

  useEffect(() => {
    if (!sessionId || !isActive) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"], // match server — no long-polling
    });
    socketRef.current = socket;

    socket.emit("join-session", sessionId);

    // Remote user joined
    socket.on("peer-connected", () => setPeerConnected(true));
    socket.on("peer-disconnected", () => {
      setPeerConnected(false);
      setPeerTyping(false);
    });

    // Remote code update — mark to suppress the echo emit
    socket.on("code-change", ({ code }) => {
      suppressNextEmit.current = true;
      onRemoteCodeChange(code);
    });

    // Remote language change — update both language and code
    socket.on("language-change", ({ language, code }) => {
      suppressNextEmit.current = true;
      onRemoteLangChange({ language, code });
    });

    // Typing indicator
    socket.on("peer-typing", (isTyping) => {
      setPeerTyping(isTyping);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionId, isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Call this inside Monaco's onChange handler.
   * Skips emit if the change came from a remote socket event.
   */
  const emitCodeChange = useCallback(
    (code) => {
      if (suppressNextEmit.current) {
        suppressNextEmit.current = false;
        return;
      }

      socketRef.current?.emit("code-change", { sessionId, code });

      // Typing indicator — emit start, then stop after 1s of inactivity
      socketRef.current?.emit("typing-start", { sessionId });
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        socketRef.current?.emit("typing-stop", { sessionId });
      }, 1000);
    },
    [sessionId]
  );

  /**
   * Call this when the language select changes.
   * Broadcasts the new language AND the reset starter code.
   */
  const emitLanguageChange = useCallback(
    (language, code) => {
      socketRef.current?.emit("language-change", { sessionId, language, code });
    },
    [sessionId]
  );

  return { emitCodeChange, emitLanguageChange, peerConnected, peerTyping };
}

export default useCodeSync;
