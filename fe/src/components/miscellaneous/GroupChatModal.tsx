"use client";
import { useState } from "react";
import useChatStore from "@/store/userStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddIcon from "@mui/icons-material/Add";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import toast from "react-hot-toast";
import UserListItem from "../chat/userlistitem";
import { FormControl } from "../ui/form";
import UserBadgeItem from "./userAvatar/userBadgeitem";
import ChatLoading from "../chat/chatLoading";
import { useForm, FormProvider } from "react-hook-form";

interface User {
  _id: string;
  name: string;
  email: string;
  pic: string;
  isAdmin: boolean;
}

interface GroupChatModalProps {
  children: React.ReactNode;
}

const GroupChatModal = ({ children }: GroupChatModalProps) => {
  const methods = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, chats, setChats } = useChatStore();

  const handleGroup = (userToAdd: User) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      alert("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user/register?search=${query}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("Failed to Load the Search Results");
    }
  };

  const handleDelete = (delUser: User) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsOpen(false);
      toast.success("New Group Chat Created!", {
        duration: 5000,
        position: "bottom-center",
      });
    } catch (error) {
      toast.error("New Group Chat not Created!", {
        duration: 5000,
        position: "bottom-center",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center text-sm md:text-base lg:text-lg dark:bg-gray-900 dark:text-white">
            <AddIcon />
            New Group Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Group Chat</DialogTitle>
          </DialogHeader>

          <FormControl>
            <Input
              placeholder="Chat Name"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add Users eg: John, Piyush, Jane"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          <div>
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </div>
          {loading ? (
            <div>
              <ChatLoading />
              Loading...
            </div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  userId={user._id}
                  userName={user.name}
                  userPic={user.pic}
                  userEmail={user.email}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}

          <DialogFooter>
            <Button onClick={handleSubmit}>Create Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
export default GroupChatModal;
