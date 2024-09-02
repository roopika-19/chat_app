"use client";
import SingleChat from "./singleChat";
import useChatStore from "@/store/userStore";

interface ChatboxProps {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chatbox = ({ fetchAgain, setFetchAgain }: ChatboxProps) => {
  const { selectedChat } = useChatStore();

  return (
    <div className="flex flex-col  bg-[#F7EFE5] w-full h-full  text-black">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default Chatbox;
