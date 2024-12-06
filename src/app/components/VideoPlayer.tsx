import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Video.js default styles
import "videojs-contrib-ads"; // Ads plugin
import "videojs-ima"; // Google IMA plugin
import "videojs-ima/dist/videojs.ima.css"; // IMA plugin styles

interface VideoPlayerProps {
  currentVideo: string; // Video source URL
}

export default function LiveVideoPlayer({ currentVideo }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<videojs.Player | null>(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [adsInitialized, setAdsInitialized] = useState(false);

  const adTagUrl ="https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=";

  // Step 1: Load the IMA SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";
    script.async = true;

    script.onload = () => {
      console.log("Google IMA SDK successfully loaded.");
      setIsSdkLoaded(true); // Mark SDK as loaded
    };

    script.onerror = () => {
      console.error("Failed to load Google IMA SDK");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Step 2: Initialize the Video.js player and IMA plugin
  useEffect(() => {
    if (!isSdkLoaded || playerRef.current || !videoRef.current) return;

    console.log("Initializing Video.js Player...");
    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      muted: true, // Required for autoplay
      preload: "auto",
      fluid: true, // Responsive video
      techOrder: ["html5"], // Use only HTML5
    });

    if (typeof window.google !== "undefined" && window.google.ima) {
      try {
        console.log("Initializing Google IMA Plugin...");
        playerRef.current.ima({
          adTagUrl,
          adsRenderingSettings: {
            enablePreloading: true, // Enable ad preloading
          },
        });

        // Handle Ad Display Container Initialization
        const startEvent = /iPhone|iPad|Android/i.test(navigator.userAgent)
          ? "touchend"
          : "click";

        playerRef.current.one(startEvent, () => {
          console.log("Initializing Ad Display Container...");
          playerRef.current!.ima.initializeAdDisplayContainer();
        });

        // Log Ad events
        playerRef.current.on("ads-ad-ended", () => {
          console.log("Ad ended. Resuming content...");
        });

        playerRef.current.on("adserror", (error: any) => {
          console.error("Ad error occurred:", error);
        });

        setAdsInitialized(true);
      } catch (error) {
        console.error("Error initializing IMA plugin:", error);
      }
    } else {
      console.error("Google IMA SDK is not loaded or unavailable.");
    }
  }, [isSdkLoaded]);

  // Step 3: Handle Video Source Changes and Reinitialize Ads
  useEffect(() => {
    if (!adsInitialized || !currentVideo || !playerRef.current) return;

    console.log("Updating video source to:", currentVideo);

    // Update video source
    playerRef.current.src({
      src: currentVideo,
      type: "application/x-mpegURL", // HLS MIME type
    });

    // Request new ads for the updated video
    try {
      playerRef.current.ima.changeAdTag(adTagUrl);
      playerRef.current.ima.requestAds();
      console.log("Ads reinitialized for new video.");
    } catch (error) {
      console.error("Error reinitializing ads:", error);
    }

    // Play the video after requesting ads
    playerRef.current.play().catch((err) => {
      console.error("Video play failed:", err);
    });
  }, [currentVideo, adsInitialized]);

  // Step 4: Cleanup on Component Unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        console.log("Disposing Video.js player...");
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
