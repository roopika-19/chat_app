"use client";
import { useEffect, useState } from "react";
import MyChats from "@/components/chat/myChat";
import SideDrawer from "@/components/miscellaneous/sideDrawer";
import Chatbox from "@/components/chat/chatBox";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import useChatStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import React from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { Dialog } from "../../components/ui/dialog";
import CallDialog from "../../components/call/callDialog";

interface ChatboxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, setUser } = useChatStore();
  const router = useRouter();

  // TODO: Add call listener for incoming call,
  //  get the data from socket to get the details,
  //  invoke the call dialog over here, with all the details

  // TODO: Turn on whem call incoming
  const [open, setOpen] = useState(false);
  // TODO: Set all the required variables
  const [calling, setCalling] = useState(false);
  const [channel, setChannel] = useState("");

  return (
    <AgoraRTCProvider client={client}>
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
      <Dialog open={open} onOpenChange={setOpen}>
        <CallDialog
          setOpen={setOpen}
          calling={calling}
          setCalling={setCalling}
          channel={channel}
        />
      </Dialog>
    </AgoraRTCProvider>
  );
};

export default Chatpage;
