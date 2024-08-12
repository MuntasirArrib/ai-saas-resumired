"use client";

import Video from 'next-video';
import myVideo from '/videos/videodemo2.mp4'; 
import { useAuth } from "@clerk/nextjs";

 
export const LandingVideo = () => {
    const { isSignedIn } = useAuth();
    return (
        <div className="px-10 pb-20">
            <div className="max-w-7xl mx-auto">
                <Video 
                    src={myVideo} 
                    className="w-full rounded-2xl overflow-hidden" 
                />
            </div>
        </div>
    )
}
