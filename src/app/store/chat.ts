// store/useCounterStore.ts
import { create } from "zustand";
import { UserType } from "./user";
import { axios } from "../utils/axios";
import { MessageType, UploadedFile } from "../components/right/ChatContainer";
export interface LastMessage {
  _id: string;
  chat: string;
  content: string;
  sender: UserType;
  files: UploadedFile[];
  createdAt: Date;
  updatedAt: Date;
}
export interface Chat {
  _id?: string;
  members?: UserType[];
  isGroup?: boolean;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  lastMessage?: LastMessage;
  unseen?: number;
}
interface chatState {
  chats: Chat[];
  index: number;
  loading: boolean;
  contact: (UserType & Chat) | null;
  setCurrentChat: (c: number) => void;
  setContact: (u: UserType | null) => void;
  fetchChats: any;
  updateChats: (type: string, newMessage?: LastMessage) => void;
}

export const useChatStore = create<chatState>((set, get) => ({
  chats: [],
  loading: false,
  index: -1,
  contact: null,
  setCurrentChat: (idx) => {
    let newchats = [...get().chats];
    newchats[idx].unseen=0;
    set({ index: idx,chats: newchats });
  },
  setContact: (u) => set({ contact: u }),
  fetchChats: async () => {
    set({ loading: true });
    const data = await axios.get<Chat[]>("/conversation/chats");
    set({ chats: data, loading: false });
  },
  updateChats: (type, newMessage) => {
    let newchats = [...get().chats];
    let { index, chats } = get();

    let foundChat = newchats.find((item) => item._id == newMessage?.chat);
    if (!foundChat) return;
    
    foundChat.lastMessage = newMessage;
    if (type == "sender") {
      return set({ chats: newchats });
    }
    if (
      (foundChat.unseen == 0 || foundChat.unseen) &&
      chats[index]?._id != foundChat?._id
    )
      foundChat.unseen++;
    set({ chats: newchats });
  },
}));
