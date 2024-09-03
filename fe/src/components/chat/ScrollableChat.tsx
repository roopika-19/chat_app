import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./chatLogic";
import useChatState from "@/store/userStore";
import { FC, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    pic: string;
  };
  content: string;
}

interface ScrollableChatProps {
  messages: Message[];
}

const ScrollableChat: FC<ScrollableChatProps> = ({ messages }) => {
  const { user } = useChatState();
  const [currentMessages, setCurrentMessages] = useState(messages);

  useEffect(() => {
    setCurrentMessages(messages);
  }, [messages]);

  return (
    <div>
      <ScrollArea className="flex flex-col  bg-[#bfc4ca] w-full h-full  text-black">
        {currentMessages &&
          currentMessages.map((m: Message, i: number) => (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(currentMessages, m, i, user?._id) ||
                isLastMessage(currentMessages, i, user?._id)) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Avatar>
                        <AvatarImage src={m.sender.pic} alt={m.sender.name} />
                        <AvatarFallback>
                          {m.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {m.sender.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user?._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(
                    currentMessages,
                    m,
                    i,
                    user?._id
                  ),
                  marginTop: isSameUser(currentMessages, m, i) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
      </ScrollArea>
    </div>
  );
};

export default ScrollableChat;
