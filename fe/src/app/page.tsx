"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import useChatStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SparklesPreview() {
  const { user } = useChatStore(); // Access the user state
  const router = useRouter();

  return (
    <div>
      <div className="flex space-x-4">
        <button className="inline-flex h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <Link href="/login">Login</Link>
        </button>
        <button className="inline-flex h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          <Link href="/register">Register</Link>
        </button>
      </div>
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden relative">
        <div className="flex space-x-4"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
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
