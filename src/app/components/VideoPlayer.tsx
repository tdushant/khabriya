import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
// import "video.js/dist/video-js.css"; // Video.js default styles
import '@videojs/themes/dist/forest/index.css';

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

  const adTagUrl = `https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=`;

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

          // Play Preroll Ad
          playerRef.current.ima.requestAds();
        });

        // Listen for AdsReady event to confirm IMA is ready
        playerRef.current.on("adsready", () => {
          console.log("Ads are ready to be played.");
          setAdsInitialized(true); // Set state indicating ads are ready
        });

        // Resume live stream after ads
        playerRef.current.on("ads-ad-ended", () => {
          console.log("Ad ended. Resuming live stream...");
          playerRef.current?.play();
        });

        playerRef.current.on("adserror", (error: any) => {
          console.error("Ad error occurred:", error);
          playerRef.current?.play(); // Resume stream if ad errors out
        });

        setAdsInitialized(true);
      } catch (error) {
        console.error("Error initializing IMA plugin:", error);
      }
    } else {
      console.error("Google IMA SDK is not loaded or unavailable.");
    }
  }, [isSdkLoaded]);

  // Step 3: Update the video source and trigger ads
  useEffect(() => {
    if (!adsInitialized || !currentVideo || !playerRef.current) return;

    console.log("Updating video source to:", currentVideo);

    // Update video source for live stream
    playerRef.current.src({
      src: currentVideo,
      type: "application/x-mpegURL", // HLS MIME type
    });

    // Pause the video and request a preroll ad
    playerRef.current.pause();

    try {
      console.log("Reinitializing Ad Display Container for new source...");
      playerRef.current.ima.initializeAdDisplayContainer(); // Ensure Ad Container is initialized
      console.log("Playing preroll ad for updated video...");
      playerRef.current.ima.requestAds(); // Request a new preroll ad
    } catch (error) {
      console.error("Error requesting ads for updated video:", error);
      playerRef.current.play(); // Resume video if ads fail
    }
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
        className="video-js vjs-theme-forest" 
        controls preload="auto"
      >
        <p>Your browser does not support the video tag.</p>
      </video>
    </div>
  );
}
