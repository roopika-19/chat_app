"use client";
import SingleChat from "./singleChat";
import useChatStore from "@/store/userStore";
import { useEffect } from "react";
import AIChat from "./aiChat";

interface ChatboxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chatbox = ({ fetchAgain, setFetchAgain }: ChatboxProps) => {
  const { aiChat, setAiChat } = useChatStore();

  return (
    <div className="flex flex-col h-screen">
      {aiChat ? (
        <AIChat />
      ) : (
        <SingleChat fetchAgain={false} setFetchAgain={() => {}} />
      )}
    </div>
  );
};

export default Chatbox;
