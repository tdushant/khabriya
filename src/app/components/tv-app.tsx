'use client'
import { useState, useCallback, useEffect, SetStateAction } from 'react'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { PlayCircle, ChevronLeft, ChevronRight, User } from 'lucide-react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import artimg from "../../../public/placeholder.svg";
import logoImg from "../../../public/logo.svg";
const channels = [
    { id: 1, name: 'News 24/7', description: 'Round-the-clock news coverage', icon: './placeholder.svg', category: 'News', videoUrl: 'https://example.com/news24-7.mp4' },
    { id: 2, name: 'Movie Central', description: 'Latest blockbusters and classics', icon: './placeholder.svg', category: 'Movies', videoUrl: 'https://example.com/movie-central.mp4' },
    { id: 3, name: 'Sports Zone', description: 'Live sports and analysis', icon: './placeholder.svg', category: 'Sports', videoUrl: 'https://example.com/sports-zone.mp4' },
    { id: 4, name: 'Music Hits', description: 'Top charts and music videos', icon: './placeholder.svg', category: 'Music', videoUrl: 'https://example.com/music-hits.mp4' },
    { id: 5, name: 'Kids Fun', description: 'Educational and entertaining content for children', icon: './placeholder.svg', category: 'Kids', videoUrl: 'https://example.com/kids-fun.mp4' },
    { id: 6, name: 'Lifestyle Today', description: 'Fashion, food, and travel', icon: './placeholder.svg', category: 'Lifestyle', videoUrl: 'https://example.com/lifestyle-today.mp4' },
    { id: 7, name: 'Tech Talk', description: 'Latest in technology and gadgets', icon: './placeholder.svg', category: 'News', videoUrl: 'https://example.com/tech-talk.mp4' },
    { id: 8, name: 'Nature Explorer', description: 'Documentaries about wildlife and nature', icon: './placeholder.svg', category: 'Lifestyle', videoUrl: 'https://example.com/nature-explorer.mp4' },
    { id: 9, name: 'Cooking Master', description: 'Culinary shows and recipes', icon: './placeholder.svg', category: 'Lifestyle', videoUrl: 'https://example.com/cooking-master.mp4' },
    { id: 10, name: 'Sci-Fi Network', description: 'Science fiction movies and series', icon: './placeholder.svg', category: 'Movies', videoUrl: 'https://example.com/scifi-network.mp4' },
    { id: 11, name: 'Documentary Hub', description: 'Exclusive documentaries from around the world', icon: './placeholder.svg', category: 'Documentaries', videoUrl: 'https://example.com/documentary-hub.mp4' },
    { id: 12, name: 'Comedy Central', description: 'Stand-up, sitcoms, and funny moments', icon: './placeholder.svg', category: 'Comedy', videoUrl: 'https://example.com/comedy-central.mp4' },
    { id: 13, name: 'Fitness & Health', description: 'Workout routines and health tips', icon: './placeholder.svg', category: 'Health', videoUrl: 'https://example.com/fitness-health.mp4' },
    { id: 14, name: 'Travel Diaries', description: 'Travel guides and destination features', icon: './placeholder.svg', category: 'Travel', videoUrl: 'https://example.com/travel-diaries.mp4' },
    { id: 15, name: 'Fashion & Style', description: 'Latest fashion trends and beauty tips', icon: './placeholder.svg', category: 'Fashion', videoUrl: 'https://example.com/fashion-style.mp4' },
    { id: 16, name: 'E-Sports Live', description: 'Live streams and highlights of E-Sports events', icon: './placeholder.svg', category: 'E-Sports', videoUrl: 'https://example.com/esports-live.mp4' },
    { id: 17, name: 'Classic Movies', description: 'Timeless classics and vintage cinema', icon: './placeholder.svg', category: 'Movies', videoUrl: 'https://example.com/classic-movies.mp4' },
    { id: 18, name: 'Animal Planet', description: 'Wildlife and animal documentaries', icon: './placeholder.svg', category: 'Nature', videoUrl: 'https://example.com/animal-planet.mp4' },
    { id: 19, name: 'History Vault', description: 'Dive deep into history with insightful content', icon: './placeholder.svg', category: 'History', videoUrl: 'https://example.com/history-vault.mp4' },
    { id: 20, name: 'DIY Network', description: 'Do it yourself tips and tricks for everything', icon: './placeholder.svg', category: 'DIY', videoUrl: 'https://example.com/diy-network.mp4' }
];

const categories = [
    'All', 'News', 'Movies', 'Sports', 'Music', 'Kids', 'Lifestyle', 
    'Documentaries', 'Comedy', 'Health', 'Travel', 'Fashion', 'E-Sports', 
    'Nature', 'History', 'DIY'
];


export default function TVApp() {
    const [currentVideo, setCurrentVideo] = useState(channels[0].videoUrl)
    const [currentChannel, setCurrentChannel] = useState(channels[0].name)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: 4, align: 'start' })

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(true)

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
    }, [emblaApi, onSelect])

    const playChannel = useCallback((channel: { videoUrl: SetStateAction<string>; name: SetStateAction<string>; }) => {
        setCurrentVideo(channel.videoUrl)
        setCurrentChannel(channel.name)
    }, [])

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category)
    }, [])

    const filteredChannels = channels.filter(channel =>
        selectedCategory === 'all' || channel.category === selectedCategory
    )

    console.log(currentChannel);
    console.log(currentVideo);
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center p-4 border-b bg-gray-200">
                <div className="flex items-center">
                    <Image src={logoImg} alt="TV App Logo" width={100} height={40} />
                </div>
                <Button variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                </Button>
            </header>
            {/* Main content area */}
            <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
                {/* Video Player (left side, 60%) */}
                <div className="w-full md:w-3/5 p-4 flex flex-col">
                    <div className="flex-grow">
                        <MediaPlayer
                            title="Big Buck Bunny Live Stream"
                            src="https://stream.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM.m3u8"
                            poster="https://image.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM/thumbnail.webp?time=30"
                            streamType="live"
                            viewType="video"
                            crossOrigin="anonymous"
                            playsInline
                            logLevel="warn"
                            autoplay
                        >
                            <MediaProvider />
                            <DefaultVideoLayout thumbnails="https://image.mux.com/v69RSHhFelSm4701snP22dYz2jICy4E4FUyk02rW4gxRM/thumbnail.webp" icons={defaultLayoutIcons} />
                        </MediaPlayer>
                    </div>
                    {/* Category buttons at the top */}
                    <div className="p-4 border-b flex flex-wrap gap-2 justify-center items-center">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* <h2 className="text-xl font-semibold mt-2">Now Playing: {currentChannel}</h2> */}
                    <h2 className="text-xl font-semibold mt-2 text-center underline">Quick Watch</h2>

                    {/* Horizontal channel slider */}
                    <div className="mt-4 relative">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex">
                                {channels.map((channel) => (
                                    <div key={channel.id} className="flex-[0_0_25%] min-w-0 px-2">
                                        <div className="p-2 text-center">
                                            <Image
                                                src={artimg}
                                                alt={channel.name}
                                                width={100}
                                                height={100}
                                                className="rounded-lg mb-2 mx-auto"
                                            />
                                            <p className="font-medium text-sm truncate">{channel.name}</p>
                                            <Button
                                                size="sm"
                                                onClick={() => playChannel(channel)}
                                                className="mt-2"
                                            >
                                                <PlayCircle className="h-4 w-4 mr-1" />
                                                Play
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button
                            size="icon"
                            variant="outline"
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Scroll left</span>
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Scroll right</span>
                        </Button>
                    </div>
                </div>

                {/* Channel List (right side, 40%) */}
                <div className="w-full md:w-2/5 p-4 border-l">
                    <h2 className="text-2xl font-bold mb-4">{selectedCategory === 'all' ? 'All Channels' : `${selectedCategory} Channels`}</h2>
                    <ScrollArea className="h-[calc(100vh-180px)]">
                        {filteredChannels.map((channel) => (
                            <div key={channel.id} className="flex items-center mb-4 p-2 hover:bg-accent rounded-lg">
                                <Image src={artimg} alt={channel.name} width={50} height={50} className="rounded-full mr-4" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{channel.name}</h3>
                                    <p className="text-sm text-muted-foreground">{channel.description}</p>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => playChannel(channel)}
                                >
                                    <PlayCircle className="h-5 w-5 mr-1" />
                                    Play
                                </Button>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}