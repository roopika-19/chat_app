import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Message from '../models/messageModel';
import Chat from '../models/chatModel';
import User from '../models/userModel';
const allMessages = asyncHandler(async (req: Request, res: Response) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId });
      const senderIds = [...new Set(messages.map(msg => msg.sender.toString()))];
      const chatId = req.params.chatId;
      const senders = await User.find({ _id: { $in: senderIds } }).select('name pic email');
      const chat = await Chat.findById(chatId).select('users chatName isGroupChat groupAdmin');
      const detailedMessages = messages.map(message => ({
        _id: message._id,
        content: message.content,
        sender: senders.find(sender => sender._id.toString() === message.sender.toString()),
        chat: chat,
        readBy: message.readBy,
      }));
  
      res.json(detailedMessages);
    } catch (error: any) {
      res.status(400);
      throw new Error(error.message);
    }
  });

const sendMessage = asyncHandler(async (req: any, res: any) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: (req as any).user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    const chat = await Chat.findById(chatId).select('users latestMessage groupAdmin');
    if (!chat) {
      return res.status(404).send("Chat not found");
    }
    const users = await User.find({ _id: { $in: chat.users } }).select('name pic email');
    const latestMessage = await Message.findById(chat.latestMessage);
    const fullChat = {
      _id: chat._id,
      chatName: chat.chatName,
      isGroupChat: chat.isGroupChat,
      users: users,
      latestMessage: latestMessage ? {
        _id: latestMessage._id,
        content: latestMessage.content,
        sender: latestMessage.sender,
        chat: latestMessage.chat,
        readBy: latestMessage.readBy,
        
      } : null,
      groupAdmin: chat.groupAdmin,
   
    };
    const fullMessage = {
      _id: message._id,
      content: message.content,
      sender: await User.findById(message.sender).select('name pic'),
      chat: fullChat,
      readBy: message.readBy,
      
    };

    await Chat.findByIdAndUpdate(chatId, { latestMessage: fullMessage });
    res.json(fullMessage);
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { sendMessage,allMessages };
