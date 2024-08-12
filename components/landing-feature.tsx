"use client";

import Image from "next/image";
import resumeImage from "@/image/resumebullet.png"; // Updated path to your image

export const LandingFeature = () => {
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
          Generate customized resume bullet points tailored to your job application
        </h2>
        <p className="text-lg sm:text-xl text-zinc-400 mt-6">
          Simply copy the job description and then copy your experience section from your current resume and paste it to our app. Our tool will generate tailored bullet points enhancing your chances of standing out.
        </p>
      </div>
    </div>
  );
};
