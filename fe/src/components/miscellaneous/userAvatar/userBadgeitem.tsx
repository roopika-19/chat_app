"use client";
import React from "react";
import { X } from "lucide-react";

interface UserBadgeItemProps {
  user: {
    _id: string;
    name: string;
  };
  adminId?: string;
  handleFunction?: () => void;
}

const UserBadgeItem: React.FC<UserBadgeItemProps> = ({
  user,
  adminId,
  handleFunction,
}) => {
  return (
    <div
      className="flex items-center space-x-2 bg-purple-600 text-white px-2 py-1 rounded-lg cursor-pointer"
      onClick={handleFunction}
    >
      <span className="font-medium text-sm">
        {user.name}
        {adminId === user._id && <span className="ml-1">(Admin)</span>}
      </span>
      <button className="text-white hover:text-gray-200">
        <X size={12} />
      </button>
    </div>
  );
};

export default UserBadgeItem;
