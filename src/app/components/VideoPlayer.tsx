"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script"; // For loading external scripts dynamically
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-ads";
import "videojs-ima";
import "videojs-ima/dist/videojs.ima.css";
// import "videojs-http-streaming";

const LiveVideoPlayer = ({currentVideo}) => {
  console.log(">>>>>>>>>>>>>>currentVideo>>>>>>>>>>>>>>>",currentVideo)

  const videoRef = useRef(null);

  useEffect(() => {
    let player;

    const initializePlayer = () => {
      // Initialize the Video.js player
      player = videojs(videoRef.current, {
        autoplay: true, // Autoplay will be managed by the ad
        controls: true,
        fluid: true, // Makes the player responsive
        preload: "auto",
        sources: [
          {
            src: currentVideo, // Main live stream
            type: "application/x-mpegURL",
            // withCredentials: true
          },
        ],
      });

      // Integrate Google IMA Ads
      player.ima({
        adTagUrl:
          "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=&skipoffset=5", // Skip ad after 5 seconds
        debug: false, // Debugging disabled
      });

      // Event: Ad finished
      player.on("ads-ad-ended", () => {
        console.log("Ad finished. Now playing main content.");
        player.play();
      });

      // Event: Ad error
      player.on("adserror", (error) => {
        console.error("Ad error:", error);
        player.play(); // Play main content if ad fails
      });

      // Midroll control: Only allow one midroll ad every X seconds
      let lastAdPlayed = 0;
      player.on("contentplayback", () => {
        const currentTime = player.currentTime();
        if (currentTime - lastAdPlayed < 60) {
          console.log("Skipping midroll ad, too soon since the last ad.");
          player.trigger("adskip");
        } else {
          lastAdPlayed = currentTime;
        }
      });
    };

    // Ensure the IMA SDK is fully loaded before initializing the player
    if (typeof window.google !== "undefined") {
      initializePlayer();
    }

    // Cleanup on unmount
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [currentVideo]);

  return (
    <div>
      {/* Load Google IMA SDK as a priority */}
      <Script
        src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
        strategy="beforeInteractive" // Ensure it's loaded before player initialization
        onLoad={() => {
          console.log("Google IMA SDK loaded successfully.");
        }}
        onError={(e) => {
          console.error("Failed to load Google IMA SDK:", e);
        }}
      />

      {/* Video.js player */}
      <video
        ref={videoRef}
        className="video-js vjs-fluid vjs-default-skin"
        controls
        preload="auto"
      />
    </div>
  );
};

export default LiveVideoPlayer;
