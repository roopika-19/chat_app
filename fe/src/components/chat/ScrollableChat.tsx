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
  const [currentMessage, setCurrentMessages] = useState(messages);

  useEffect(() => {
    console.log("***** ", messages);
    setCurrentMessages(messages);
  }, [messages]);

  return (
    <ScrollableFeed>
      {currentMessage &&
        currentMessage.map((m: Message, i: number) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(currentMessage, m, i, user?._id) ||
              isLastMessage(currentMessage, i, user?._id)) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar>
                      <AvatarImage src={m.sender.pic} alt={m.sender.name} />
                      <AvatarFallback>{m.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{m.sender.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user?._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(currentMessage, m, i, user?._id),
                marginTop: isSameUser(currentMessage, m, i) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
