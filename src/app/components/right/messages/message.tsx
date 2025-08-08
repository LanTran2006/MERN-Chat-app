import React from "react";
import { MessageType } from "../ChatContainer";
import { timeConverter } from "@/app/utils/token";

function Message({message, senderIsUser}: {message: MessageType, senderIsUser: boolean}) {
  if (!message.content) return null;
  return (
    <div
      key={message._id}
      className={`${
        senderIsUser ? "bg-green-600" : "bg-[#3b4a54] w-fit"
      } text-white text-sm pr-3 pl-2 py-1 rounded-lg max-w-1/2`}
    >
      <p>{message.content}</p>
      <p className="text-right text-xs text-white/70">
        {timeConverter(new Date(message.createdAt))}
      </p>
    </div>
  );
}

export default Message;
