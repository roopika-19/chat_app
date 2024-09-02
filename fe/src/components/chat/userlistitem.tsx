"use client"
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserListItemProps {
  userId: string;
  userName: string;
  userPic: string;
  userEmail: string;
  handleFunction: () => void;
}

const UserListItem: FC<UserListItemProps> = ({
  userName,
  userPic,
  userEmail,
  handleFunction,
}) => {
  return (
    <div
      onClick={handleFunction}
      className="hover:bg-teal-500 hover:text-white flex items-center p-2 mb-2 rounded-lg cursor-pointer"
    >
      <Avatar className="mr-2">
        <AvatarImage src={userPic} alt={userName} />
        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p>{userName}</p>
        <div className="text-xs">
          <strong>Email: </strong>{userEmail}
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
