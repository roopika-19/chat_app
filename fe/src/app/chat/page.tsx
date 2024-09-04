"use client";
import { useEffect, useState } from "react";
import MyChats from "@/components/chat/myChat";
import SideDrawer from "@/components/miscellaneous/sideDrawer";
import { cn } from "@/lib/utils";
import Chatbox from "@/components/chat/chatBox";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import useChatStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import { getLocalStorage } from "@/utils/localStorageHelper";
import { animate, motion } from "framer-motion";
import React from "react";
interface ChatboxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}
const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, setUser } = useChatStore();
  const router = useRouter();

  return (
    <div className=" h-screen flex flex-col ">
      <div className="w-full  text-white  ">
        <SideDrawer />
      </div>

      <Separator className="w-full min-h-0.5  bg-black dark:bg-white" />

      <ResizablePanelGroup direction="horizontal" className="flex-2">
        <ResizablePanel>
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </ResizablePanel>
        <ResizableHandle className="flex items-center justify-center bg-black cursor-col-resize min-w-0.5"></ResizableHandle>
        <ResizablePanel>
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chatpage;
