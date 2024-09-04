"use client";
import React, { useState } from "react";
import useChatStore from "@/store/userStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AiIcon from "../assets/ai-icon.png"; // Replace with the path to your AI logo

const AIChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { setAiChat } = useChatStore();

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newMessage.trim()) {
      setNewMessage("");
      const apiKey = "AIzaSyBUiQ497Inc9lBHA9VbT81BtyKtex7IpjU";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;

      try {
        const response = await axios.post(
          apiUrl,
          {
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: newMessage,
                  },
                ],
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API response:", response.data);

        // Extract the content from the API response
        const aiResponse =
          response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response";

        setMessages((prevMessages) => [
          ...prevMessages,
          { content: newMessage, sender: "user" },
          { content: aiResponse, sender: "ai" },
        ]);
      } catch (error) {
        alert("Error sending message to AI.");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-5">
        <div className="messages dark:text-black">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-center mb-2 ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.sender === "ai" && (
                <Avatar>
                  <AvatarImage
                    src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    alt="AI Logo"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender === "user" ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: m.sender === "ai" ? "10px" : "0",
                  marginTop: "5px",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  wordBreak: "break-word",
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="items-center w-full p-2">
        <Input
          id="message"
          placeholder="Ask something..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow h-12 border bg-gray-800 border-black rounded mb-2"
        />
        <Button
          type="submit"
          className="h-12 bg-gray-800 text-white rounded px-4 flex items-center justify-center"
        >
          <ArrowForwardIcon className="h-6" />
        </Button>
      </form>
    </div>
  );
};

export default AIChat;
