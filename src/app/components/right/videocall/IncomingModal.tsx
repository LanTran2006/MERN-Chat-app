'use client';

import { incomingCallType } from '@/app/hooks/useSocket';
import { Phone, PhoneOff } from 'lucide-react';

interface IncomingCallModalProps {
  incomingCall: incomingCallType;
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function IncomingCallModal({
  incomingCall,
  onAccept,
  onDecline,
}: IncomingCallModalProps) {
  if (!incomingCall.isRing) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#755a5a40] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <h2 className="text-xl  font-bold text-gray-700 mb-2">Incoming Video Call</h2>
        <p className="text-gray-400 mb-6 font-semibold">{incomingCall.caller?.username} is calling you...</p>

        <div className="flex justify-center gap-6">
          <button
            onClick={onDecline}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            <PhoneOff className="w-5 h-5" />
            Decline
          </button>

          <button
            onClick={onAccept}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
          >
            <Phone className="w-5 h-5" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
