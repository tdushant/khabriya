"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-ads";
import "videojs-ima";
import "videojs-ima/dist/videojs.ima.css";

interface LiveVideoPlayerProps {
    currentVideo: string; // The video URL directly
    channelChanged: boolean; // Flag to detect channel change
}

const LiveVideoPlayer: React.FC<LiveVideoPlayerProps> = ({ currentVideo, channelChanged }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!currentVideo) {
            console.error("No currentVideo provided.");
            return;
        }

        console.log("Initializing player with currentVideo:", currentVideo);

        const initializePlayer = () => {
            // Dispose of the previous instance if it exists
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }

            // Initialize video.js player
            const player = videojs(videoRef.current, {
                autoplay: false,
                controls: true,
                fluid: true,
                preload: "auto",
                sources: [
                    {
                        src: currentVideo,
                        type: "application/x-mpegURL", // For HLS streams
                    },
                ],
            });

            playerRef.current = player;

            // Check if Google IMA is loaded before initializing ads
            if (typeof window.google !== "undefined" && window.google.ima) {
                try {
                    player.ima({
                        adTagUrl:
                            "http://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=xml_vmap1&unviewed_position_start=1&cust_params=sample_ar%3Dpremidpostpod%26deployment%3Dgmf-js&cmsid=496&vid=short_onecue&correlator=&skipoffset=5",
                    });

                    player.on("ads-ad-ended", () => {
                        console.log("Ad finished, playing main content.");
                        player.play();
                    });

                    player.on("adserror", (error: any) => {
                        console.error("Ad error:", error);
                        player.play();
                    });
                } catch (error) {
                    console.error("Error initializing Google IMA:", error);
                }
            } else {
                console.warn("Google IMA is not loaded.");
            }
        };

        initializePlayer();

        // Clean up on unmount or before reinitialization
        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
                playerRef.current = null;
            }
        };
    }, [currentVideo]); // Reinitialize whenever currentVideo changes

    return (
        <div>
            <Script
                src="https://imasdk.googleapis.com/js/sdkloader/ima3.js"
                strategy="beforeInteractive"
                onLoad={() => console.log("Google IMA SDK loaded.")}
                onError={(e) => console.error("Failed to load Google IMA SDK:", e)}
            />
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
