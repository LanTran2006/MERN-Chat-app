"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Users, RefreshCw, MessageCircle, MoreVertical, Group } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore, UserType } from "@/app/store/user";
import { axios } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import { useClickOutside } from "@/app/hooks/useClickOutSide";


const menuItems = [
  "New group",
  "New community",
  "Starred messaged",
  "Settings",
  "Logout",
];
interface headerProps {
  user: UserType | null;
  reset: () => void;
  setGr: Dispatch<SetStateAction<boolean>>
}
function ChatHeader({ user, reset,setGr }: headerProps) {
  const [open, setOpen] = useState(false);
  let {storeInfo}=useAuthStore()
  let menuRef = useClickOutside<HTMLDivElement>(()=>setOpen(false));
  const router = useRouter();
  let handleMenu = (type: (typeof menuItems)[number]) => {
    if (type == "Logout") handleLogout();
  };
  const handleLogout = async () => {
    const data = await axios.get("/api/logout");
    reset();
    if (!data.isErr)  showToast.success(data.message);
    storeInfo(null,null)
    router.push("/");
  };

 
  return (
    <div ref={menuRef} className="bg-[#222C32] h-12 flex items-center justify-between px-4 shadow-md">
      {/* Left avatar */}
      <Image
        alt="avatar"
        className=" rounded-full"
        width={40}
        height={40}
        src={
          user?.avatar ||
          "https://cdn-icons-png.freepik.com/512/6858/6858504.png"
        }
      />

      {/* Right icons */}
      <div className="flex items-center space-x-4 text-gray-200">
        <Users onClick={()=>setGr(prev=>!prev)} className="w-5 h-5" />
        <RefreshCw className="w-5 h-5" />
        <MessageCircle onClick={()=>setGr(false)} className="w-5 h-5" />
        <div className=" relative">
          <MoreVertical onClick={() => setOpen(!open)} className="w-5 h-5" />
          {open && (
            <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-md bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5">
              <ul className="py-1 text-gray-200">
                {menuItems.map((item, idx) => (
                  <li
                    onClick={() => handleMenu(item)}
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
