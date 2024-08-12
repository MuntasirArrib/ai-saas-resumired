"use client";

import Image from "next/image";
import resumeImage from "@/image/network.png"; // Updated path to your image

export const LandingFeature3 = () => {
  return (
    <div className="px-10 py-20 bg-[#0F172A] flex flex-col lg:flex-row items-center gap-10">
      {/* Left Side: Image */}
      <div className="flex-1">
        <Image 
          src={resumeImage} 
          alt="Resume Example" 
          className="rounded-3xl shadow-lg"
          priority
        />
      </div>

      {/* Right Side: Text */}
      <div className="flex-1 text-center lg:text-left">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
          Network like a pro! Connect with industry leaders with customized note
        </h2>
        <p className="text-lg sm:text-xl text-zinc-400 mt-6">
          Simply fill out the details and let AI craft a connection request note for you that you can use to connect with your industry leaders and grow your network!
        </p>
      </div>
    </div>
  );
};
