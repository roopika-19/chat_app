"use client";
import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import SearchIcon from "@mui/icons-material/Search";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import ChatLoading from "@/components/chat/chatLoading";
import UserListItem from "@/components/chat/userlistitem";
import { Progress } from "@/components/ui/progress";
import useChatStore from "@/store/userStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileModal from "../chat/profileModal";
import { getSenderFull } from "../chat/chatLogic";

export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useChatStore();
  const { setTheme } = useTheme();

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
        `http://localhost:5000/api/user/register?search=${search}`,
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
    console.log(userId);

    // if (!user || !selectedChat) {
    //   console.log("Hello");
    //   return;
    // }

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );

      console.log("****** ", data);

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

  return (
    <div className="flex items-center p-4 space-x-4">
      <div className="relative">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          aria-label="Search"
        >
          <SearchIcon />
        </Button>
        <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
          <DrawerOverlay />
          <DrawerContent className="w-full max-w-xs">
            <DrawerHeader>Search Users</DrawerHeader>
            <div className="flex pb-2 space-x-2">
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
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
            {loadingChat && <Progress value={33} />}
          </DrawerContent>
        </Drawer>
      </div>

      {user && (
        <ProfileModal user={user}>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.pic} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </ProfileModal>
      )}

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
