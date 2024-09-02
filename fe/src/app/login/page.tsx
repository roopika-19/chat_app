import { LoginForm } from "@/components/forms/loginForm";

import { Boxes } from "@/components/ui/background-boxes";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  p-20 bg-gray-800">
      
      <LoginForm />
    </main>
  );
}
