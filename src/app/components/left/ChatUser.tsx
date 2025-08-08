"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthStore, UserType } from "../../store/user";
import { useChatStore } from "@/app/store/chat";
import { groupImg } from "@/app/utils/toast";
import { handleDay, handleLastMessage } from "@/app/utils/token";
import { axios } from "@/app/utils/axios";

function ChatUsers() {
  let user = useAuthStore().user as UserType;
  let {
    setCurrentChat,
    index,
    chats,
    fetchChats,
    loading,
  } = useChatStore();
  let chatData=chats[index];
  useEffect(() => {
    fetchChats();
  }, []);

  if (loading) {
    return <div className="text-white p-4">Loading chats...</div>;
  }
  let handleClick=async (idx: number)=>{
     let res=await axios.post('/conversation/seen',{
        chatId: chats[idx]._id
     })
     setCurrentChat(idx);
     
  }

  return (
    <div>
      {/* Loop through each chat */}
      {chats?.map((chat,idx) => {
        const isActive = chat._id === chatData?._id;
        const unseenCount = chat.unseen || 0;

        return (
          <div
            key={chat._id}
            className={`flex justify-between items-center p-2 py-4 hover:bg-[#222C32] border-b-[0.1px] border-white ${
              isActive ? "bg-[#222C32]" : ""
            }`}
            onClick={() => handleClick(idx)}
          >
            {/* ==== LEFT SIDE: Avatar + Chat Info ==== */}
            <div className="flex space-x-3 items-center w-full relative">
              {/* Avatar */}
              <Image
                src={
                  chat.isGroup
                    ? groupImg
                    : chat.members?.find((u) => u._id !== user?._id)?.avatar ||
                      ""
                }
                alt={chat.name || "Group"}
                width={45}
                height={45}
                className="rounded-full"
              />

              {/* 🔴 Unseen Message Badge */}
              {unseenCount > 0 && !isActive && (
                <div className="absolute -top-1 left-9 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {unseenCount > 99 ? "99+" : unseenCount}
                </div>
              )}
              {/* ==== Chat Text Info ==== */}
              <div className="flex flex-col flex-1 w-full">
                {/* Chat Name */}
                <div className="flex justify-between text-sm font-medium text-white">
                  <span>
                    {chat.isGroup
                      ? chat.name
                      : chat.members?.find((u) => u._id !== user?._id)
                          ?.username}
                  </span>
                </div>

                {/* Last Message + Timestamp */}
                <div className="flex items-center justify-between text-xs text-gray-400 space-x-1">
                  <span>
                    <b className="text-sm">
                      {chat.lastMessage &&
                        (chat.lastMessage.sender._id === user?._id
                          ? "You"
                          : chat.lastMessage.sender.username)}
                    </b>
                    {": "}
                    {handleLastMessage(user, chat.lastMessage)}
                  </span>
                  <p>{handleDay(chat.updatedAt)}</p>
                </div>
              </div>
            </div>
            {/* ==== END LEFT SIDE ==== */}
          </div>
        );
      })}
    </div>
  );
}

export default ChatUsers;
