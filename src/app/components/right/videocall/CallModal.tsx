'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface VideoCallModalProps {
  onClose?: () => void;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export default function VideoCallModal({
  onClose,
  localStream,
  remoteStream,
}: VideoCallModalProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream ?? null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream ?? null;
    }
    return () => {
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };
  }, [localStream, remoteStream]);

  // Hide modal if no video streams are available
  if (!localStream && !remoteStream) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#00000040] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Video Call</h2>

        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          {/* Large Video: show remote if available, else local */}
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
            />
          ) : (
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          )}

          {/* Corner Local Video shown only when remoteStream exists */}
          {remoteStream && (
            <video
              ref={localVideoRef}
              className="w-32 h-20 absolute bottom-2 right-2 rounded-md border-2 border-white object-cover"
              autoPlay
              muted
              playsInline
            />
          )}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
            End Call
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300">
            Mute
          </button>
        </div>
      </div>
    </div>
  );
}
