"use client";
import { Play, Pause } from "lucide-react";
import { UploadedFile } from "../ChatContainer";
import { useState, useEffect } from "react";

export default function AudioCard({
  file,
  senderIsUser,
}: {
  file: UploadedFile;
  senderIsUser: boolean;
}) {
  const [audio, setAudio] = useState<null | HTMLAudioElement>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  //const [currentTime,setCurrentTime]=useState(0);
  const handleTogglePlayback = () => {
    if (isPlaying) {
      audio?.pause();
      setIsPlaying(false);
    } else {
      audio?.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    let newAud = new Audio(file.path);
    newAud.addEventListener("ended", () => {
      setIsPlaying(false);
      newAud.currentTime = 0;
    });
    newAud.addEventListener("loadedmetadata", () => {
      setDuration(newAud.duration);
    });
    setAudio(newAud);
  }, [file]);
  return (
    <div
      key={file._id}
      className={`${
        senderIsUser ? "bg-green-600" : "bg-[#3b4a54]"
      } text-white text-sm p-2 rounded-lg w-[30%]`}
    >
      {/* First Row: Audio player controls */}
      <div className="flex items-center gap-2">
        {/* Play/Pause button */}
        <button className="p-2" onClick={handleTogglePlayback}>
          {isPlaying ? (
            <Pause className="text-white w-5 h-5" />
          ) : (
            <Play className="text-white w-5 h-5" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white mx-1" />
        <span>{Math.floor(duration)}s</span>
      </div>

      {/* Second Row: Duration and Timestamp */}
      <div className="flex justify-end gap-3 mt-1 text-xs text-gray-300">
        <span>12:34</span>
      </div>
    </div>
  );
}
