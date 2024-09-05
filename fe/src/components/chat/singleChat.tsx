"use client";
import React, { useCallback, useEffect, useState } from "react";
import useChatStore from "@/store/userStore";
import { getSender, getSenderFull } from "./chatLogic";
import ProfileModal from "./profileModal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import logo from "../animations/logo.json";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import WebRTCChat from "../call/callDialog";
import { Dialog } from "../ui/dialog";
import CallDialog from "../call/callDialog";
// import nanoid from "nanoid";

interface SingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Message {
  chat: any;
  _id: string;
  sender: {
    _id: string;
    name: string;
    pic: string;
  };
  content: string;
}

const ENDPOINT = "http://localhost:5000";
let socket: ReturnType<typeof io>;
let selectedChatCompare: any;

const SingleChat: React.FC<SingleChatProps> = ({
  fetchAgain,
  setFetchAgain,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const { selectedChat, user, notification, setNotification } = useChatStore();
  const [openCallDialog, setOpenCallDialog] = useState(false);
  const [calling, setCalling] = useState(false);
  // TODO: Use a constant channel ID, send this VIA socket to other user.
  const [channel, setChannel] = useState("123456789");
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newMessage.trim() && user) {
      setNewMessage("");
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `http://localhost:5000/api/message`,
          { content: newMessage, chatId: selectedChat._id },
          config
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        alert(error);
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert(error);
    }
  };

  const renderSenderInfo = () => {
    if (!user || !selectedChat) return null;

    return !selectedChat.isGroupChat ? (
      <div className="flex items-center justify-between dark:bg-[#2b363c] p-2 border-black border-solid-2px rounded ">
        <span className="text-lg font-bold">
          {getSender(user, selectedChat.users)}
        </span>
        <div className="flex items-center space-x-2">
          <ProfileModal user={getSenderFull(user, selectedChat.users)}>
            <Avatar>
              <AvatarImage src={user?.pic} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </ProfileModal>
          {/* <WebRTCChat userId={getSenderFull(user, selectedChat.users)._id} /> */}
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-between dark: bg-blue-300 p-2 rounded-lg border-b">
        <span className="text-lg font-bold">
          {selectedChat.chatName.toUpperCase()}
        </span>
      </div>
    );
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const refreshChatPage = useCallback((newChat: Message) => {
    setMessages((messages) => {
      return [...messages, newChat];
    });
  }, []);

  useEffect(() => {
    socket.on("message_received", (newMessageRecieved: Message) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        // refreshChatPage(newMessageRecieved);
      }
    });
  }, [
    messages,
    notification,
    // refreshChatPage,
    selectedChatCompare,
    fetchAgain,
  ]);

  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className="flex flex-col h-screen">
      <Dialog open={openCallDialog} onOpenChange={setOpenCallDialog}>
        <div className="flex-1 ">
          {selectedChat ? (
            <>{renderSenderInfo()}</>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-3xl font-bold text-center">
                Click on a user to start chatting
              </span>
            </div>
          )}
        </div>

        {selectedChat && (
          <>
            <div className="overflow-y-auto p-5">
              <div className="messages  dark:text-black ">
                <ScrollableChat messages={messages} />
              </div>

              {istyping && (
                <div className="typing-indicator mt-2 flex items-center">
                  <div className="rounded-full bg-blue-200">
                    <Lottie options={defaultOptions} />
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={sendMessage} className=" items-center w-full ">
              <Input
                id="message"
                placeholder="Press Enter to message..."
                value={newMessage}
                onChange={typingHandler}
                className="flex-grow h-12  border  bg-gray-800 border-black rounded  mb-8"
              />
              <Button
                type="submit"
                className="h-12 bg-gray-800 text-white rounded px-4 flex items-center justify-center"
              >
                <ArrowForwardIcon className="h-6" />
              </Button>
            </form>
          </>
        )}
        <CallDialog
          setOpen={setOpenCallDialog}
          calling={calling}
          setCalling={setCalling}
          channel={channel}
        />
      </Dialog>
    </div>
  );
};
export default SingleChat;
