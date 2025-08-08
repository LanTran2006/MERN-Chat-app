'use client';

import { Trash2, Pause, Send } from "lucide-react";
import { useEffect, useRef } from "react";

export default function AudioRecorderBar({
  onCancel,
  onRecord,
  onSubmit
}: {
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
  onRecord: (aud: File | Blob) => void;
  onSubmit: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let audioChunks: BlobPart[] = [];

    async function startRecording() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        onRecord(audioBlob);
        audioChunks = []; 
      };

      recorder.start();
    }

    startRecording();

    return () => {
      mediaRecorder.current = null;
      mediaStreamRef.current = null;
    };
  }, [onRecord]);

  return (
    <div className="flex items-center gap-3 bg-[#11181C] text-white rounded-full px-4 py-2 shadow-lg w-full">
      <button onClick={onCancel}>
        <Trash2 className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
      </button>

      <div className="bg-[#1D1F23] text-red-500 text-sm px-3 py-1 rounded-full font-medium">
        Recording
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          className="p-2 rounded-full hover:bg-red-600 bg-red-500"
          onClick={() => {
            if (mediaRecorder.current?.state === "recording") {
              mediaRecorder.current.stop();
            }
          }}
        >
          <Pause className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={onSubmit}
          className="p-2 rounded-full hover:bg-gray-700 bg-gray-800"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
