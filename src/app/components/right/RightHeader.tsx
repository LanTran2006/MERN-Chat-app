"use client";
import React, { useEffect, useState } from "react";
import { MoreVertical, Search, Video } from "lucide-react";
import Image from "next/image";
import { groupImg, showToast } from "@/app/utils/toast";
import { useSocket } from "@/app/hooks/useSocket";
import VideoCallModal from "./videocall/CallModal";
import { useAuthStore } from "@/app/store/user";
import Peer, { SignalData } from "simple-peer";
function RightHeader({ info }: { info: any }) {
  let { onlineUsers, setlocalStream, setPeer, setRemoteStream ,setIncomingCall} = useSocket();
  let isOnline = onlineUsers.includes(info._id);
  let { socket } = useSocket();
  let { user } = useAuthStore();
  let handleCall = async () => {
    try {
      const newstream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: newstream,
        config: {
          iceServers: [
            {
              urls: "stun:numb.viagenie.ca",
              username: "sultan1640@gmail.com",
              credential: "98376683",
            },
            {
              urls: "turn:numb.viagenie.ca",
              username: "sultan1640@gmail.com",
              credential: "98376683",
            },
          ],
        },
      });
      if (newstream) setlocalStream(newstream);
      peer.on("signal", (sign) => {
        socket?.emit("call", {
          receiver: info._id,
          caller: user,
          signal: sign,
        });
      });
      peer.on("stream", (stream) => {
        console.log(stream);
        setRemoteStream(stream);
      });
       socket?.on("callAccepted", (obj: { signal: SignalData}) => {
        let signal=obj.signal;
        setIncomingCall({
          caller: user,
          receiver: info,
          isRing: false,
          signal
        })
        peer.signal(signal);
    });
      socket?.on('callDeclined',()=>{
         showToast.error(info.username+` decline you call`);
         setlocalStream(null)
         setPeer(null)
      })
      setPeer(peer);
    } catch (error) {
      showToast.error("cannot call for now");
    }
  };
  return (
    <header className="w-full h-14 bg-[#2a2f38] text-white flex items-center px-4 justify-between shadow">
      {/* Left Section: Avatar and Name */}
      <div className="flex items-center space-x-3">
        <Image
          src={info?.avatar || groupImg}
          alt={info?.username || info?.name || "user image"}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="text-lg capitalize font-medium">
            {info?.username || info?.name}
          </p>
          <p
            className={`text-sm ${
              isOnline ? " text-green-400" : " text-white"
            }`}
          >
            {isOnline ? "online" : "offline"}
          </p>
        </div>
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center space-x-4">
        <Video
          onClick={handleCall}
          size={23}
          className="cursor-pointer text-gray-300"
        />
        <Search size={18} className="cursor-pointer text-gray-300" />
        <MoreVertical size={18} className="cursor-pointer text-gray-300" />
      </div>
    </header>
  );
}

export default RightHeader;
