import React, {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Mic, Paperclip, Send, Smile } from "lucide-react";
import { Chat, useChatStore } from "@/app/store/chat";
import { axios } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import FilePreview from "./FilePreview";
import { useAuthStore } from "@/app/store/user";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useClickOutside } from "@/app/hooks/useClickOutSide";
import { MessageType } from "./ChatContainer";
import AudioRecorderBar from "./audio/AudioInput";

function ChatInput({
  ref,
  setMessages,
}: {
  ref: React.RefObject<HTMLDivElement | null>;
  setMessages: Dispatch<SetStateAction<MessageType[]>>;
}) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<(File | Blob)[]>([]);
  const { index,chats, contact, updateChats } = useChatStore();
  let chat=chats[index];
  const [showPicker, setShowPicker] = useState(false);
  let { user } = useAuthStore();
  const emojiRef = useClickOutside<HTMLDivElement>(() => setShowPicker(false));
  const inputRef = useRef<HTMLInputElement>(null);
  let [audioMode, setAudioMode] = useState(false);
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };
  useEffect(()=>{
       setAudioMode(false)
  },[chat])
  useEffect(()=>{
      setFiles([])
  },[audioMode])
  let handleSend = async () => {
    if (!files.length && !message) return;
    let chatId = chat?._id;
    if (!chat?._id) {
      let res = await axios.post<Chat>("/conversation/create", {
        members: [user?._id, contact?._id],
      });
      chatId = res._id;
    }
    const formData = new FormData();

    formData.append("chatId", chatId as string);
    formData.append("content", message);
    files.forEach((file) => {
      formData.append("files", file);
    });

    let res = await axios.post("/conversation/message", formData);
    setMessage("");
    setFiles([]);
    if (!res.isErr) {
      showToast.success("message sent successfully");
      setMessages((prev) => [...prev, res]);
      updateChats('sender',res);
    }
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };
  
  if (audioMode) {
    return (
      <AudioRecorderBar
        onSubmit={handleSend}
        onRecord={(aud: File | Blob) => setFiles([aud])}
        onCancel={() => setAudioMode(false)}
      />
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-[#2a2f38] px-4 py-2 flex items-center space-x-4 relative"
    >
      {/* Emoji icon */}
      <Smile
        onClick={() => setShowPicker(!showPicker)}
        size={22}
        className="text-gray-400 cursor-pointer"
      />

      {/* Attachment icon */}
      <label htmlFor="file-input" className="cursor-pointer">
        <Paperclip size={22} className="text-gray-400 rotate-45" />
        <input
          ref={inputRef}
          id="file-input"
          type="file"
          multiple
          onChange={handleFileChange}
          onClick={(e) => ((e.target as HTMLInputElement).value = "")}
          className="hidden"
        />
      </label>

      {/* Input field */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 bg-[#3a3f47] text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none"
      />

      {/* Send icon */}
      <button type="submit" className="focus:outline-none">
        {message ? (
          <Send size={22} className=" text-gray-400 cursor-pointer" />
        ) : (
          <Mic
            onClick={() => setAudioMode(true)}
            size={22}
            className=" text-gray-400 cursor-pointer"
          />
        )}
      </button>
      {showPicker && (
        <div ref={emojiRef} className="absolute bottom-full left-0 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {files.length ? (
        <FilePreview
          onClick={handleSend}
          message={message}
          setMessage={setMessage}
          setFiles={setFiles}
          files={files as File[]}
        />
      ) : null}
    </form>
  );
}

export default ChatInput;
