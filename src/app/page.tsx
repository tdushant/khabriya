import Head from "next/head";
import TVApp from "./components/tv-app";
import VideoPlayer from "./components/VideoPlayer";
import 'video.js/dist/video-js.css'; // Core Video.js styles
import '@videojs/themes/dist/forest/index.css'; // Forest theme styles


export default function Home() {
	return (
		<main>
			{/* <VideoPlayer/> */}
			<TVApp />
		</main>
	)
}