import { Plus, Send, X } from "lucide-react";
import Image from "next/image";
import React, { FormEvent, useRef, useState } from "react";
interface propTypes {
  files: File[];
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<any>>;
  setFiles: React.Dispatch<React.SetStateAction<any>>;
  onClick: () => Promise<void>;
}

function handleMedia(file: File) {
    let ext = file?.name?.slice(file?.name.lastIndexOf(".") + 1);
    let type = ["png", "jpg"].includes(ext)
      ? "img"
      : ["mp3", "mp4"].includes(ext)
      ? "vid"
      : "file";
    if (type=='img') {
       <Image
          width={10}
          height={100}
          className=" w-[30%]"
          alt="img or video"
          src={URL.createObjectURL(file)}
        />
    }
    if (type=='vid') {
       return <video
              src={URL.createObjectURL(file)}
              controls
              autoPlay
              className="w-[60%]  object-cover rounded border"
            />
    }
    return  <Image
          width={10}
          height={100}
          className=" w-[30%]"
          alt="img or video"
          src={`/${ext}.png`}
        />
}
function handleOtherMedia(file: File) {
    let ext = file.name.slice(file.name.lastIndexOf(".") + 1);
    let type = ["png", "jpg"].includes(ext)
      ? "img"
      : 'other'
    if (type=='img') {
       <Image
          width={10}
          height={100}
          className=" w-[30%]"
          alt="img or video"
          src={URL.createObjectURL(file)}
        />
    }
    return  <Image
          width={10}
          height={100}
          className=" w-[30%]"
          alt="img or video"
          src={`/${ext}.png`}
        />
}


function FilePreview({
  files,
  setFiles,
  message,
  setMessage,
  onClick,
}: propTypes) {
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;
    setFiles((prev: File[]) => [...prev, ...Array.from(newFiles)]);
  };
  let handleDelete = (idx: number) => {
    setFiles(files.filter((item, index) => idx != index));
  };
 
  return (
    <div className=" absolute inset-0 bg-[#2A2A2A] p-4">
      <X
        onClick={() => setFiles([])}
        size={22}
        className="text-gray-400 cursor-pointer"
      />

      <div className="flex flex-col items-center gap-5 w-[95%] mx-auto">
        <p>{files[idx]?.name}</p>
        {handleMedia(files[idx])}
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="type a message"
          className="bg-[#1c2733] text-white px-4 py-2 rounded outline-none w-full "
        />
      </div>
      <div className="flex items-center justify-center gap-2 mt-4 border-t border-white pt-4 relative">
        {files.map((file, index) => {
          return (
            <div
              onClick={() => setIdx(index)}
              key={index}
              className="relative group w-15 h-15 rounded border border-white/20 flex items-center justify-center overflow-hidden cursor-pointer"
            >
             {handleOtherMedia(file)}

              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="absolute top-0 right-0 bg-black/60 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Add Button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-12 h-12 rounded border border-white/20 flex items-center justify-center hover:bg-white/10"
        >
          <Plus className="text-white w-4 h-4" />
        </button>
        <input
          hidden
          onChange={handleFilesChange}
          ref={inputRef}
          type="file"
          name=""
          id=""
        />
        {/* Send Button */}
        <div className="flex absolute right-0">
          <button className="bg-emerald-500 rounded-full p-4 hover:bg-emerald-600 transition">
            <Send className="text-white w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
