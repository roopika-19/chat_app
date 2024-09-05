"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import useChatStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";

export default function SparklesPreview() {
  const { user } = useChatStore(); // Access the user state
  const router = useRouter();
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },

    {
      title: "Login",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/login",
    },
    {
      title: "Register",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/register",
    },
    {
      title: "Chat",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/chat",
    },

    {
      title: "Github",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/roopika-19",
    },
  ];
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden relative">
        <div className="flex space-x-4"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="fixed top-12 left-100 mt-5 ">
            <FloatingDock mobileClassName="translate-y-20" items={links} />
          </div>
          <h1 className="font-extrabold text-white z-20 tracking-wider drop-shadow-md font-serif text-3xl lg:text-5xl">
            Welcome to Chat App
          </h1>
          {/* Gradients */}
          <div className="w-[40rem] relative mt-3">
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
            <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
            <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

            {/* Core component */}
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />

            {/* Radial Gradient to prevent sharp edges */}
            <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
