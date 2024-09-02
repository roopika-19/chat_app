import create from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  pic: string;
  isAdmin: boolean;
  token?: string; 
}

interface ChatState {
  selectedChat: any;
  setSelectedChat: (chat: any) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  notification: any[];
  setNotification: (notifications: any[]) => void;
  chats: any[];
  setChats: (chats: any[]) => void;
}

const useChatStore = create<ChatState>((set) => ({
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  user: null,
  setUser: (user) => set({ user }),
  notification: [],
  setNotification: (notifications) => set({ notification: notifications }),
  chats: [],
  setChats: (chats) => set({ chats }),
}));

export default useChatStore;
