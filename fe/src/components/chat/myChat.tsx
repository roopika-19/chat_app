"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import useChatStore from "@/store/userStore";
import { getSender } from "./chatLogic";
import ChatLoading from "./chatLoading";
import GroupChatModal from "../miscellaneous/GroupChatModal";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLocalStorage } from "@/utils/localStorageHelper";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  pic: string;
  isAdmin: boolean;
}
interface MyChatsProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyChats = ({ fetchAgain }: MyChatsProps) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null); // Update the state type
  const {
    selectedChat,
    setSelectedChat,
    setUser,
    user,
    chats,
    setChats,
    aiChat,
    setAiChat,
  } = useChatStore();

  const router = useRouter();

  const fetchChats = async () => {
    if (!user) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/chat`,
        config
      );

      setChats(data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const isToken: any = getLocalStorage("token");
    if (isToken) {
      const loggedInUser = JSON.parse(getLocalStorage("userInfo") ?? "{}");
      setUser({
        _id: loggedInUser._id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        pic: loggedInUser.pic,
        isAdmin: loggedInUser.isAdmin,
        token: loggedInUser.token,
      });
      setLoggedUser(loggedInUser);
      localStorage.setItem("token", loggedInUser.token);
    } else if (!isToken) {
      localStorage.clear();
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, [user]);

  return (
    <>
      <div className="flex justify-between items-center p-3  font-sans text-lg md:text-xl text-white border- dark:bg-black">
        My Chats
        <GroupChatModal>hey</GroupChatModal>
      </div>
      <Separator className="w-full min-h-0.5  bg-black dark:bg-white" />
      <ScrollArea className="flex flex-col p-3 dark:bg-black w-full h-full dark: text-white">
        <div className="flex flex-col h-full w-full dark: bg-black ">
          <div
            onClick={() => {
              setAiChat(true);
              setSelectedChat(null);
            }}
            className="p-5 rounded-lg cursor-pointer mb-2 bg-purple-900 text-white"
          >
            <div className="mb-2">AI Chat</div>
          </div>
          {chats ? (
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat);
                  setAiChat(false);
                }}
                className={`p-5 rounded-lg cursor-pointer mb-2 ${
                  selectedChat === chat
                    ? "bg-[#2b363c] text-white"
                    : "bg-gray-900 text-white"
                }`}
              >
                <div className="mb-2">
                  {!chat.isGroupChat
                    ? loggedUser
                      ? getSender(loggedUser, chat.users)
                      : "Loading..."
                    : chat.chatName}
                </div>
                {chat.latestMessage && (
                  <div className="text-xs mt-1">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </div>
                )}
              </div>
            ))
          ) : (
            <ChatLoading />
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default MyChats;
