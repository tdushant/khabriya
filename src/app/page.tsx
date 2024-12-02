import Head from "next/head";
import TVApp from "./components/tv-app";
import VideoPlayer from "./components/VideoPlayer";

export default function Home() {
	return (
		<main>
			{/* <VideoPlayer/> */}
			<TVApp />
		</main>
	)
}