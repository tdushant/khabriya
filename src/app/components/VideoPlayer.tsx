import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Video.js default styles
import "videojs-contrib-ads"; // Ads plugin
import "videojs-ima"; // Google IMA plugin
import "videojs-ima/dist/videojs.ima.css"; // IMA plugin styles

interface VideoPlayerProps {
  currentVideo: string;
}

export default function LiveVideoPlayer({ currentVideo }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<videojs.Player | null>(null);
  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false); // Track if the player has been initialized

  useEffect(() => {
    console.log("🚀 ~ LiveVideoPlayer ~ currentVideo:", currentVideo);

    if (!videoRef.current) {
      console.warn("Video element is not mounted yet.");
      return;
    }

    // Initialize the player once when it has not been initialized yet
    if (!isPlayerInitialized) {
      console.log("🚀 ~ Initializing Video.js with currentVideo:", currentVideo);

      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        muted: true, // Required for autoplay
        preload: "auto",
        fluid: true, // Responsive video
        techOrder: ["html5"], // Use only HTML5
      });

      playerRef.current.on("error", () => {
        console.error("Video.js error:", playerRef.current?.error());
      });

      setIsPlayerInitialized(true);
    }

    // Update the video source dynamically when `currentVideo` changes
    if (isPlayerInitialized && currentVideo) {
      console.log("🚀 ~ Updating video source to:", currentVideo);

      playerRef.current?.src({
        src: currentVideo,
        type: "application/x-mpegURL", // HLS MIME type
      });

      playerRef.current?.play().catch((err) => {
        console.error("Video play failed:", err);
      });
    }
  }, [currentVideo, isPlayerInitialized]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player style={{ position: "relative" }}>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        style={{ width: "100%", height: "100%" }}
      >
        <p>Your browser does not support the video tag.</p>
      </video>
    </div>
  );
}
