"use client";

import { useAuthStore, UserType } from "@/app/store/user";
import { axios } from "@/app/utils/axios";
import { showToast } from "@/app/utils/toast";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function AddUserToGroup({onSuccess}: {onSuccess: ()=>void}) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [members, setMembers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  let { user } = useAuthStore();
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    let timer = setTimeout(() => {
       setLoading(true);
      axios
        .get<UserType[]>(
          `/users/search?query=${encodeURIComponent(search)}&userOnly=true`
        )
        .then((res) => {
          const filtered = res.filter(
            (u) => !members.some((m) => m._id === u._id)
          );
          setSearchResults(filtered);
          setLoading(false);
        });
    },500);
    return () => clearTimeout(timer);
  }, [search, members]);

  function addMember(user: UserType) {
    setMembers((prev) => [...prev, user]);
    
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m._id !== id));
  }

  async function handleCreate() {
    if (!groupName.trim()) {
      showToast.error("Please enter a group name");
      return;
    }
    if (members.length === 0) {
      showToast.error("Add at least one member");
      return;
    }

    await axios.post("/conversation/create", {
      name: groupName,
      members: [...members.map((m) => m._id), user?._id],
    });
    showToast.success("Group created!");
    setGroupName("");
    setMembers([]);
    setSearch("");
    onSuccess()
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 text-white rounded-lg">
      <label className="block mb-2 font-semibold" htmlFor="groupName">
        New group
      </label>
      <input
        id="groupName"
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group name"
        className="w-full mb-3 px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
      />

      <div className="flex flex-wrap gap-2 mb-3">
        {members.map((member) => (
          <div
            key={member._id}
            className="flex items-center bg-gray-700 rounded px-2 py-1 text-sm"
          >
            <Image
              src={member.avatar || ""}
              alt={member.username}
              width={20}
              height={20}
              className="rounded-full mr-1 object-cover"
            />
            <span>{member.username}</span>
            <button
              onClick={() => removeMember(member._id)}
              className="ml-2 text-red-400 hover:text-red-600"
              aria-label={`Remove ${member.username}`}
              type="button"
            >
              &times;
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Add members..."
          className="flex-grow bg-gray-800 px-3 py-2 rounded border border-gray-700 focus:outline-none focus:border-blue-500 min-w-[120px]"
        />
      </div>

      {search && (
        <div className="max-h-48 overflow-auto bg-gray-800 border border-gray-700 rounded shadow-md">
          {loading ? (
            <div className="p-2 text-center text-gray-400">Loading...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => addMember(user)}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-3 py-2"
              >
                <Image
                  src={user.avatar || ""}
                  alt={user.username}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
                <span>{user.username}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">No users found</div>
          )}
        </div>
      )}

      <button
        onClick={handleCreate}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        Create
      </button>
    </div>
  );
}
