import { Skeleton } from "@/components/ui/skeleton";

const ChatLoading = () => {
  return (
    <div className="space-y-2">
      {[...Array(12)].map((_, index) => (
        <Skeleton key={index} className="w-[200px] h-[20px] rounded-full" />
      ))}
    </div>
  );
};

export default ChatLoading;
