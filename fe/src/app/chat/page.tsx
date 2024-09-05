"use client";
import { useEffect, useRef, useState } from "react";
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
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { Dialog } from "../../components/ui/dialog";
import CallDialog from "../../components/call/callDialog";
import { BACKEND_URL } from "@/const";
import { io, Socket } from "socket.io-client";

interface ChatboxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useChatStore();
  const router = useRouter();

  const ENDPOINT = `${BACKEND_URL}`;
  const socketRef = useRef<Socket | null>(null);

  const [open, setOpen] = useState(false);
  const [calling, setCalling] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [channel, setChannel] = useState("");

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.disconnect(); // Ensure old connection is closed
    }

    socketRef.current = io(ENDPOINT);

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("incoming call", (data) => {
      console.log("Received incoming call:", data);
      setOpen(true);
      setIncoming(true);
      setChannel(data.channel);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Cleanup function to disconnect socket on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected on cleanup");
      }
    };
  }, [ENDPOINT]);

  // Decline call
  const declineCall = () => {
    if (socketRef.current) {
      socketRef.current.emit("call_decline", {
        to: user?._id, // Receiving user ID
      });
    }
    setOpen(false); // Close the dialog
  };

  return (
    <AgoraRTCProvider client={client}>
      <div className="h-screen flex flex-col">
        <div className="w-full text-white">
          <SideDrawer />
        </div>

        <Separator className="w-full min-h-0.5 bg-black dark:bg-white" />

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
          declineCall={declineCall}
        />
      </Dialog>
    </AgoraRTCProvider>
  );
};

export default Chatpage;
