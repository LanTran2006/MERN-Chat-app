"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuthStore, UserType } from "../store/user";
import { SignalData } from "simple-peer";
import Peer, { Instance as PeerInstance, Options as PeerOptions } from 'simple-peer';
export interface incomingCallType {
  receiver: UserType | null;
  caller: UserType | null;
  signal: SignalData | null;
  isRing: boolean
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
  incomingCall: incomingCallType;
  setIncomingCall: React.Dispatch<React.SetStateAction<incomingCallType>>;
  localStream: MediaStream | null;
  setlocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  remoteStream: MediaStream | null;
  setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  peer: PeerInstance | null;
  setPeer: React.Dispatch<React.SetStateAction<PeerInstance | null>>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
  incomingCall: { caller: null, signal: null ,receiver: null,isRing: false},
  setIncomingCall: () => {},
  localStream: null,
  setlocalStream: () => {},
  remoteStream: null,
  setRemoteStream: () => {},
  peer: null,
  setPeer: ()=>{},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  let [incomingCall, setIncomingCall] = useState<incomingCallType>({
    caller: null,
    signal: null,
    receiver: null,
    isRing: false
  });
  let [localStream, setlocalStream] = useState<MediaStream | null>(null);
  let [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  let [peer,setPeer]=useState<PeerInstance | null>(null)
  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
    });
    newSocket.emit("online", user._id);
    newSocket?.on("getOnlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });
    newSocket.on("incommingCall", (call: incomingCallType) => {
      console.log(call);
      setIncomingCall({...call,isRing: true});
    });
   
   
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);
  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        incomingCall,
        setIncomingCall,
        localStream,
        setlocalStream,
        remoteStream,
        setRemoteStream,
        peer,
        setPeer
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
