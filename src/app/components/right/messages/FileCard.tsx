"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { UploadedFile } from "../ChatContainer";

type FileCardProps = {
  file: UploadedFile;
  ext: string;
  senderIsUser: boolean;
};

export default function FileCard({
  file,
  ext ,
  senderIsUser,
}: FileCardProps) {
  const downloadFile = async () => {
    const response = await fetch(file.path);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name; 
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
  };


  return (
    <div
      className={` text-white rounded-md p-3 w-full max-w-xs relative ${
        senderIsUser ? "bg-green-600" : "bg-[#3b4a54] w-fit"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* File Icon */}
        <Image alt={ext} width={40} height={40} src={`/${ext}.png`} />
        {/* File Info */}
        <div className="flex-1">
          <p className="text-sm font-medium line-clamp-1">{file.name}</p>
          <p className="text-xs text-white/80">
            {ext.toUpperCase()}, {12}
          </p>
        </div>

        {/* Download Icon */}
        <button className="text-white/80 hover:text-white transition">
          <Download onClick={downloadFile} className="w-4 h-4" />
        </button>
      </div>

      {/* Time */}
      <p className="absolute bottom-1 right-2 text-[10px] text-white/60">
        {"12:34"}
      </p>
    </div>
  );
}
