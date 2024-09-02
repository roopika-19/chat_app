import { RegisterForm } from "@/components/forms/registerForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  p-20 bg-gray-800">
      <RegisterForm/>
    </main>
  );
}
