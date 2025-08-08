import React, { useEffect, useState } from "react";
import {
  Archive,
  Search,
  Menu,
  ArrowLeft,
} from "lucide-react";
import ChatUsers from "./ChatUser";
import ChatHeader from "./ChatHeader";
import { useAuthStore, UserType } from "../../store/user";
import { axios } from "@/app/utils/axios";
import ContactUsers from "./contactUsers";
import { Chat } from "@/app/store/chat";
import AddUserToGroup from "./AddGroup";

function Sidebar() {
  let { user, reset } = useAuthStore();
  const [query, setQuery] = useState("");
  const [data, setData] = useState<(UserType & Chat)[]>([]);
  let [gr, setGr] = useState(false);
  useEffect(() => {
    if (!query) return;
    let timer = setTimeout(async () => {
      const data = await axios.get(`/users/search?query=${query}`);
      setData(data);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [query]);
  if (gr) {
    return (
      <div className="w-[30%] h-full bg-[#2a2a2a] border-r-[0.5px] border-white">
        <ChatHeader setGr={() => setGr(!gr)} user={user} reset={reset} />
        <AddUserToGroup onSuccess={() => setGr(false)} />
      </div>
    );
  }
  return (
    <div className="w-[30%] h-full bg-[#2a2a2a] border-r-[0.5px] border-white">
      <ChatHeader setGr={setGr} user={user} reset={reset} />

      {/* Search Bar */}
      <div className="bg-[#1E1E1E] rounded flex items-center h-10 px-3">
        {query ? (
          <ArrowLeft
            onClick={() => setQuery("")}
            className="w-4 h-4 text-gray-400"
          />
        ) : (
          <Search className="w-4 h-4 text-gray-400" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Aratın veya yeni sohbet başlatın"
          className="bg-transparent text-sm text-white placeholder-gray-400 outline-none px-3 flex-1"
        />
        <Menu className="w-4 h-4 text-gray-400" />
      </div>

      {/* Archived */}
      <div className="flex items-center space-x-2 p-3 text-sm text-gray-300">
        <Archive className="w-4 h-4" />
        <span>Arşivlenmiş</span>
      </div>

      <hr className="border-gray-700" />

      {/* Chat Items */}
      {query ? <ContactUsers users={data} /> : <ChatUsers />}
    </div>
  );
}

export default Sidebar;
