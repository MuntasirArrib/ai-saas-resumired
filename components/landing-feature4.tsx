"use client";

import Image from "next/image";
import resumeImage from "@/image/coverletter.png"; // Use your existing image path

export const LandingFeature4 = () => {
  return (
    <div className="px-10 py-20 bg-[#0F172A] flex flex-col-reverse lg:flex-row items-center gap-10">
      {/* Right Side: Text (Inverted) */}
      <div className="flex-1 text-center lg:text-left">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
          Generate cover letters that win! 
        </h2>
        <p className="text-lg sm:text-xl text-zinc-400 mt-6">
          Simply upload your resume and copy and paste the job description, and let the magic happen. Our AI model is going to generate tailored cover letters highlighting your experience from your resume and address the key job requirements to enable you to land that interview!
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
