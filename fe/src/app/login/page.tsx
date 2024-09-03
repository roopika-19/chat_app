"use client";
import { LoginForm } from "@/components/forms/loginForm";
import { SparklesCore } from "@/components/ui/sparkles";
import React from "react";

export default function Home() {
  return (
    <div className="h-screen w-screen relative bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="relative z-20">
        <h2 className="text-3xl md:text-7xl lg:text-5xl font-bold text-center text-white">
          Welcome to Chat App
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
