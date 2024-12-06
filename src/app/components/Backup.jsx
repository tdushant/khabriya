"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-ads/dist/videojs.ads.css";
import "videojs-ima/dist/videojs.ima.css";
import 'videojs-contrib-ads';
import 'videojs-ima';

if (typeof window !== "undefined") {
  require("videojs-contrib-ads");
  require("videojs-ima");
}

interface VideoPlayerProps {
  currentVideo: string;
  adTagUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ currentVideo, adTagUrl }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  console.log("Say hello url>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",currentVideo)
  useEffect(() => {
    let player: videojs.Player | null = null;

    const initializePlayer = () => {
      if (videoRef.current) {
          player = videojs(videoRef.current, {
          controls: true,
          autoplay: true,
          preload: "auto",
          fluid: true, // Makes the player responsive
          liveui: true, // Enables live stream UI
          techOrder: ["html5"], // Ensure only HTML5 tech is used
          html5: {
              vhs: {
                  withCredentials: true // Set true if authentication is required
              },
              sources: [
                {
                    src: {currentVideo},
                    type: "application/x-mpegURL",
                    withCredentials: true
                },
              ],
          }
        });

        const options = {
          id: "content_video",
          adTagUrl,
          adsRenderingSettings: {
            enablePreloading: true,
          },
        };

        // Initialize IMA plugin
        player.ima(options);

        // Handle Ad playback
        const startEvent = /iPhone|iPad|Android/i.test(navigator.userAgent)
          ? "touchend"
          : "click";

        player.one(startEvent, () => {
          player.ima.initializeAdDisplayContainer();
        });
      }
    };

    // Load IMA SDK
    const script = document.createElement("script");
    script.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";
    script.async = true;
    script.onload = initializePlayer;
    document.body.appendChild(script);

    return () => {
      if (player) {
        player.dispose();
      }
      document.body.removeChild(script);
    };
  }, [adTagUrl]);

  return (
    <div>
      <video
        ref={videoRef}
        id="content_video"
        className="video-js vjs-default-skin"
        data-setup="{}"
      >
        <source src={currentVideo} type="application/x-mpegURL" />
      </video>
    </div>
  );
};

export default VideoPlayer;


// ________________________________________________________Workin on someting here so that we can get to the right position ______________
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
  const [isPlayerInitialized, setIsPlayerInitialized] = useState(false); // Track if the player has been initialized

  const adTagUrl =
    "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=&skipoffset=5000"; // Hardcoded ad tag URL

      // Load IMA SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

      // Integrate IMA plugin
      if (typeof window.google !== "undefined" ) {
        try {
            console.log("🚀 ~ useEffect ~ playerRef:", playerRef)
        playerRef.current.ima({
            adTagUrl:"http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=&skipoffset=5000", // Hardcoded ad tag URL
            adsRenderingSettings: {
              enablePreloading: true, // Enable ad preloading
            },
          });

          // Handle Ad playback initialization
          const startEvent = /iPhone|iPad|Android/i.test(navigator.userAgent)
            ? "touchend"
            : "click";

          playerRef.current.one(startEvent, () => {
            console.log("Initializing IMA Ad Display Container");
            playerRef.current!.ima.initializeAdDisplayContainer();
          });

          // Log Ad events
          playerRef.current.on("ads-ad-ended", () => {
            console.log("Ad finished, resuming content.");
          });

          playerRef.current.on("adserror", (error: any) => {
            console.error("Ad error:", error);
          });
        } catch (error) {
          console.error("Error initializing Google IMA:", error);
        }
      } else {
        console.log("Google IMA SDK not loaded.");
      }

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
