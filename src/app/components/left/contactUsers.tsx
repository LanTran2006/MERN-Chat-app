'use client';
import React  from "react";
import Image from "next/image";
import { useAuthStore, UserType } from "../../store/user";
import { Chat, useChatStore } from "@/app/store/chat";
import { groupImg } from "@/app/utils/toast";
import { handleLastMessage } from "@/app/utils/token";


function ContactUsers({users=[]}: {users: (UserType & Chat)[]}) {
  let currUser=useAuthStore().user;
  let {setContact,contact,setCurrentChat}=useChatStore()
  let handleClick=(u: any)=>{
       if (u.isGroup) {
            setCurrentChat(u);
            setContact(null)
       } 
       else setContact(u);
  }

  return (
    <div>
      {users.map((user) => (
        <div
          onClick={()=>handleClick(user)}
          key={user._id}
           className={`flex justify-between items-center p-4 hover:bg-[#222C32] border-b-[0.1px] border-white ${
            contact?._id === user._id ? 'bg-[#222C32]' : ''
          }`}
        >
          {/* Avatar and content */}
          <div className="flex space-x-3 items-center">
            <Image
              src={
               user.isGroup ? groupImg :  (user.avatar || user.members?.find(item=>item._id!=currUser?._id)?.avatar || '')
              }
              alt={user.username || user.name || 'image user'}
              width={45}
              height={45}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <div className="flex justify-between text-sm font-medium text-white">
                <span>{user.isGroup ? user.name :  (user.username || user.members?.find(item=>item._id!=currUser?._id)?.username|| '')}</span>
              </div>
              <div className="flex items-center text-xs text-gray-400 space-x-1">
                <span>{handleLastMessage(currUser,user.lastMessage)}</span>
              </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

export default ContactUsers;
