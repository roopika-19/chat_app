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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming you have an Avatar component or you can use an HTML img tag

interface User {
  _id: string;
  name: string;
  email: string;
  pic: string;
  isAdmin: boolean;
}

interface ProfileModalProps {
  user: User;
  children?: React.ReactNode;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          <span>{children}</span>
        ) : (
          <Button variant="outline">View Profile</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
          <DialogDescription>Email: {user.email}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-between py-4">
          <Avatar>
            <AvatarImage src={user.pic} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => {}}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
