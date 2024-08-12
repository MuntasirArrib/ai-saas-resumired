"use client";

import { useAuth } from "@clerk/nextjs";

export const LandingVideo = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="px-10 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl">
          <iframe
            src="https://www.youtube.com/embed/Af-pjFbl_ZQ"  // Replace with your YouTube video ID
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
