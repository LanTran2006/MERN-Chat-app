"use client";
import React, { useEffect } from "react";
import Sidebar from "../components/left/sidebar";
import ChatContainer from "../components/right/ChatContainer";
import IncomingCallModal from "../components/right/videocall/IncomingModal";
import { useSocket } from "../hooks/useSocket";
import Peer, { SignalData } from "simple-peer";
import VideoCallModal from "../components/right/videocall/CallModal";
function Page() {
  let {
    incomingCall,
    setIncomingCall,
    socket,
    localStream,
    remoteStream,
    setlocalStream,
    setRemoteStream,
    setPeer,
    peer,
  } = useSocket();
  let handleAccept = async () => {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    let signal = incomingCall.signal as SignalData;
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
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
    peer.on("stream", (otherstream) => {
      setRemoteStream(otherstream);
      setlocalStream(stream);
    });
    peer.on("signal", (data) => {
      socket?.emit("accept-call", {
        to: incomingCall.caller?._id,
        signal: data,
      });
    });
    peer.signal(signal);
    setPeer(peer);
  };
  let handleClose = () => {
    setlocalStream(null);
    setRemoteStream(null);
    peer?.destroy();
    socket?.emit(
      "end-call",
      incomingCall.isRing
        ? incomingCall.caller?._id
        : incomingCall.receiver?._id
    );
    setIncomingCall({
      caller: null,
      receiver: null,
      signal: null,
      isRing: false,
    });
    setPeer(null);
  };
  let handleDecline = () => {
    setIncomingCall({
      caller: null,
      receiver: null,
      signal: null,
      isRing: false,
    });
    socket?.emit("declineCall", {
      to: incomingCall.caller?._id,
    });
  };
  useEffect(() => {
    socket?.on("callEnded", () => {
      setlocalStream(null);
      setRemoteStream(null);
      setIncomingCall({
      caller: null,
      receiver: null,
      signal: null,
      isRing: false,
    })
      peer?.destroy();
      setPeer(null)
    });
    return ()=>{socket?.off('callEnded')}
  }, [socket]);
  return (
    <section className=" h-screen w-full flex shadow">
      <Sidebar />
      <ChatContainer />
      <IncomingCallModal
        onAccept={handleAccept}
        onDecline={handleDecline}
        incomingCall={incomingCall}
      />
      <VideoCallModal
        localStream={localStream}
        remoteStream={remoteStream}
        onClose={handleClose}
      />
    </section>
  );
}

export default Page;
