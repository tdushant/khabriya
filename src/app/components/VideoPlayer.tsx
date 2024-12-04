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
