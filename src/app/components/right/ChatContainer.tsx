import React, { useEffect, useRef, useState } from "react";
import RightHeader from "./RightHeader";
import ChatInput from "./ChatInput";
import { useChatStore } from "@/app/store/chat";
import { useAuthStore, UserType } from "@/app/store/user";
import { axios } from "@/app/utils/axios";
import Message from "./messages/message";
import FileMessage from "./messages/fileMessage";
import Image from "next/image";
import { useSocket } from "@/app/hooks/useSocket";
import AudioMessage from "./messages/AudioCard";

export interface UploadedFile {
  path: string;
  name: string;
  _id: string;
}

export interface MessageType {
  _id: string;
  chat: string;
  content: string;
  sender: UserType;
  files: UploadedFile[];
  createdAt: Date;
  updatedAt: Date;
}

function ChatContainer() {
  let { index,chats,contact, setCurrentChat, setContact ,updateChats} = useChatStore();
  let chat=chats[index];
  let chatId=chat?._id;
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const {socket}=useSocket()
  useEffect(()=>{
      socket?.on('message',async (mess: MessageType)=>{
         if (chatId==mess.chat) {
              setMessages(prev=>[...prev,mess]);
              await await axios.post('/conversation/seen',{
                      chatId
                   })
         } 
          updateChats('receiver',mess);
      })
      return ()=>{
        socket?.off('message')
      }
  },[socket,chatRef,chats,index])
  useEffect(()=>{
       chatRef?.current?.scrollTo({
        top: chatRef?.current.scrollHeight,
        behavior: "smooth",
      });
     
  },[messages])
  useEffect(() => {
    setMessages([]);
    const fetchChat = async () => {
      if (contact) {
        const data = await axios.get(`/conversation/user/${contact._id}`);
        setCurrentChat(data.chat);
        if (data.chat) setContact(null);
        
        return;
      }
      if (chatId) {
        const data = await axios.get<MessageType[]>(`/conversation/${chatId}`);
        setMessages(data);
        
        return;
      }
    };
    fetchChat();
  }, [chatId, contact]);

  if (!chatId && !contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#242E34]">
        <p className="text-white/70">Select a chat to start messaging</p>
      </div>
    );
  }
  let other = chat?.isGroup
    ? chat
    : chat?.members?.find((u) => u?._id != user?._id) || contact;
   
  return (
    <div className="flex-1 bg-[url('/bg-dark.png')] bg-cover bg-no-repeat bg-center flex flex-col h-full relative">
      <RightHeader info={other} />
      <div ref={chatRef} className="flex flex-1 flex-col gap-4 p-4 h-screen overflow-y-auto">
        {messages.map((message) => {
          let senderIsUser = message.sender._id === user?._id;
          return (
            <>
              <div
                key={message._id}
                className={` flex items-center gap-2 ${senderIsUser ? " justify-end" : ""}`}
              >
                {!senderIsUser && message.content && (
                  <Image
                    alt="img"
                    width={50}
                    height={50}
                    className=" rounded-full"
                    src={message.sender.avatar}
                  />
                )}
                <Message message={message} senderIsUser={senderIsUser} />
              </div>

              {message.files.map((item) => (
                <div
                  key={item._id}
                  className={` flex gap-2 items-center ${
                    senderIsUser ? " justify-end" : ""
                  }`}
                >
                  {!senderIsUser && (
                    <Image
                      alt="img"
                      width={30}
                      height={30}
                      className=" rounded-full w-[45px]"
                      src={message.sender.avatar}
                    />
                  )}
                  <FileMessage
                    key={item._id}
                    item={item}
                    senderIsUser={senderIsUser}
                  />
                </div>
              ))}
            </>
          );
        })}
      </div>
      <ChatInput setMessages={setMessages} ref={chatRef} />
    </div>
  );
}

export default ChatContainer;
