"use client";

import Image from "next/image";
import resumeImage from "@/image/profilesummary.png"; // Use your existing image path

export const LandingFeature2 = () => {
  return (
    <div className="px-10 py-20 bg-[#0F172A] flex flex-col-reverse lg:flex-row items-center gap-10">
      {/* Right Side: Text (Inverted) */}
      <div className="flex-1 text-center lg:text-left">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
          Generate your profile summary 
        </h2>
        <p className="text-lg sm:text-xl text-zinc-400 mt-6">
          Let AI generate a customised Profile Summary that highlights your most important skills and crafts a compelling summary of your career!
        </p>
      </div>

      {/* Left Side: Image (Inverted) */}
      <div className="flex-1">
        <Image 
          src={resumeImage} 
          alt="Resume Example" 
          className="rounded-3xl shadow-lg"
          priority
        />
      </div>
    </div>
  );
};
