"use client";
import { RegisterForm } from "@/components/forms/registerForm";
import { SparklesCore } from "@/components/ui/sparkles";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-20 bg-black relative">
      {/* Add the Sparkle effect in the background */}
      <div className="absolute inset-0">
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

      {/* Make sure the form content is above the SparklesCore */}
      <h3 className="text-3xl md:text-7xl lg:text-4xl font-bold text-center text-white">
        Welcome to Chat App
      </h3>
      <div className="relative z-10">
        <RegisterForm />
      </div>
    </main>
  );
}
