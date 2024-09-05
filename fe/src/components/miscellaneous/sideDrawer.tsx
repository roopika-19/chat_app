"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import SearchIcon from "@mui/icons-material/Search";
import Lottie from "react-lottie";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import ChatLoading from "@/components/chat/chatLoading";
import UserListItem from "@/components/chat/userlistitem";
import useChatStore from "@/store/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileModal from "../chat/profileModal";
import { getSender } from "../chat/chatLogic";
import animationData from "@/components/animations/bell.json";
import animationData2 from "@/components/animations/spinner1.json";
import { BACKEND_URL } from "@/const";
export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const defaultOptions2 = {
    loop: true,
    autoplay: true,
    animationData: animationData2,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = useChatStore();
  const { theme, setTheme } = useTheme();

  const handleSearch = async () => {
    if (!search) {
      toast("Please enter something in search", {
        duration: 5000,
        position: "top-left",
        icon: "⚠️",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(
        `${BACKEND_URL}api/user/register?search=${search}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast("Error occurred while searching", {
        duration: 5000,
        position: "top-left",
        icon: "⚠️",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId: string) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post(
        `${BACKEND_URL}api/chat`,
        { userId },
        config
      );

      if (!chats.find((c: { _id: string }) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      toast("Error occurred while accessing chat", {
        duration: 5000,
        position: "top-left",
        icon: "⚠️",
      });
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex justify-between h-13 items-center p-4 dark:bg-black dark:text:white rounded">
      <div className="relative">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          aria-label="Search"
        >
          <SearchIcon />
        </Button>

        <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
          <DrawerContent className="max-w-[35vw] h-full p-5">
            <DrawerHeader>Search Users</DrawerHeader>
            <div className="flex gap-3 w-full justify-center">
              <div className="flex gap-3">
                <Input
                  placeholder="Search user or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </div>
            </div>
            {loading ? (
              <ChatLoading />
            ) : (
              <div className="mt-4 space-y-2">
                {searchResult?.map((user: any) => (
                  <UserListItem
                    key={user._id}
                    userId={user._id}
                    userName={user.name}
                    userPic={user.pic}
                    userEmail={user.email}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))}
              </div>
            )}

            {loadingChat && (
              <Lottie options={defaultOptions2} height={100} width={100} />
            )}
          </DrawerContent>
        </Drawer>
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <ProfileModal user={user}>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.pic} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </ProfileModal>
        )}

        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <button className=" w-full ">
                {typeof window !== "undefined" && (
                  <Lottie options={defaultOptions} height={100} width={100} />
                )}
              </button>
            </MenubarTrigger>
            <MenubarContent>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenubarItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {user &&
                    (notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(
                          user,
                          notif.chat.users
                        )}`)}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
}
