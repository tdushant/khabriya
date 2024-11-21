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
import logoImg from "../../../public/logo.svg";
import axios from 'axios';


export default function TVApp() {
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(true)
    const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: 4, align: 'start' })
    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    const [currentVideo, setCurrentVideo] = useState('')
    const [currentChannel, setCurrentChannel] = useState('')
    const [selectedChannelCategory, setSelectedChannelCategory] = useState('Hindi')
    const [quick_watch, setquick_watch] = useState([])
    const [Categories, setCategories] = useState([])
    const [account, setAccountDetails] = useState([])
    const [AllChannels, SetAllChannels] = useState([])

    // const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    // const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_API_AUTH_TOKEN;
    const API_BASE_URL = 'https://api-houston.khabriya.in/api/v3';
    const API_AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmZGQ3YjMzLWY2ZGItNDNlOC05NmM0LTFkNDMyYjc2NDI4NCIsIm1hY19hZGRyZXNzIjoibWFjX2FkZHJlc3MiLCJpYXQiOjE3MzE5NDE0NTF9.RrgsywJ4zNcTfER0Kd48bQZWCQoKO3GOmqYF0PBhPfyc1MOoXwTXVSQzYV1k-60Ch3sD8lWMXFOtC9rFIzOKSFD8hpzoQSzG07FpOLdtgYASuD49pBCk-1EsEOAArX3dWoumHe0C52Uw-NvABdDM1lLIMcQZxsh1DTA1SxMZUfGuPX5oMmdXdFKqyRX0LX8Xa_aDfvA7dhvyPsdqxyMXn_ieeJK9BzzW5NJYKW68gwpOAF6yjzJI-lDYQHKBeqsXSXEpL_vaESdLnZT-gBgvzuC6GgoMCwO8YVu99X7OWc-dDYvS35JJ9Oq0WePm-WBbRHe61iUD4UmsFZS4SCO_3A';

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
    }, [emblaApi, onSelect])

    //------------------------Quick-channels Start----------------------------//
    const ListQuickChannels = useCallback(async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/quick-channels`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${API_AUTH_TOKEN}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
            setquick_watch(response.data.data);
            // if (response.data.data.length > 0) {
            //     setCurrentVideo(response.data.data[0].stream_url);
            //     setCurrentChannel(response.data.data[0].channel_name);
            // }

        } catch (error) {
            console.error('Error fetching channels:', error);
        }
    }, []);

    useEffect(() => {
        ListQuickChannels();
    }, [ListQuickChannels]);
    //------------------------Quick-channels End----------------------------//

    //-----------------------Channel categories start-------------------------//
    const ChannelCategories = useCallback(async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/languages`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${API_AUTH_TOKEN}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching Categories:', error);
        }
    }, []);

    useEffect(() => {
        ChannelCategories();
    }, [ChannelCategories]);

    const handleChannelCategoryChange = useCallback((category: string) => {
        setSelectedChannelCategory(category)
    }, [])
    //-----------------------Channel categories end-------------------------//

    //-----------------------All channels start-------------------------//
    const fetchAllChannels = useCallback(async () => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/channels`,
                {
                    "language": selectedChannelCategory
                },
                {
                    headers: {
                        'Authorization': `Bearer ${API_AUTH_TOKEN}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            SetAllChannels(response.data.data);
            if (response.data.data.length > 0) {
                setCurrentVideo(response.data.data[0].stream_url);
                setCurrentChannel(response.data.data[0].channel_name);
            }

        } catch (error) {
            console.error('Error fetching channels:', error);
        }
    }, [selectedChannelCategory]);

    useEffect(() => {
        fetchAllChannels();
    }, [fetchAllChannels, selectedChannelCategory]);
    //-----------------------All channels end-------------------------//

    // ------------------------ Deep links Start----------------------//
    // const matchingChannel = quick_watch.find(
    //     (channel) => channel.channel_name === currentChannel
    //   );

    //   const deeplinks = useCallback(async (matchingChannel) => {
    //     if (!matchingChannel?.id) {
    //         console.error('matchingChannel or id is not defined');
    //         return;
    //     }
    //     console.log();


    //     try {
    //         const response = await axios.post(
    //             `${API_BASE_URL}/deep-link`,
    //             { id: matchingChannel.id },
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${API_AUTH_TOKEN}`,
    //                     'Content-Type': 'application/json',
    //                     Accept: 'application/json',
    //                 },
    //             }
    //         );
    //         console.log('API Response:', response.data);
    //     } catch (error) {
    //         console.error('Error fetching deep links:', error);
    //     }
    // }, []);

    // useEffect(() => {
    //     if (matchingChannel) {
    //         deeplinks(matchingChannel);
    //     }
    // }, [currentChannel, matchingChannel, deeplinks]);
    // ----------------------- Deep links End-------------------------//

    // --------------------- Account Details Start-------------------//
    // const getAccount = useCallback(async () => {
    //     try {
    //         const response = await axios.post(
    //             `${API_BASE_URL}/account-info`,
    //             {},
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${API_AUTH_TOKEN}`,
    //                     'Content-Type': 'application/json',
    //                     Accept: 'application/json',
    //                 },
    //             }
    //         );
    //         setAccountDetails(response.data.data);
    //     } catch (error) {
    //         console.error('Error fetching Account Details:', error);
    //     }
    // }, []);

    // useEffect(() => {
    //     getAccount();
    // }, [getAccount]);
    // --------------------- Account Details End--------------------//

    const playChannel = useCallback((channel: {
        channel(channel_name: any): unknown; videoUrl: SetStateAction<string>; name: SetStateAction<string>;
    }) => {
        setCurrentVideo(channel.stream_url);
        setCurrentChannel(channel.channel_name);
    }, [])

    return (
        <div className="min-h-screen text-foreground flex flex-col">
            {/* Header */}
            <header className="flex justify-between items-center p-4 bg-[var(--e-global-color-primary)] text-white">
                <div className="flex items-center">
                    <Image src={logoImg} alt="TV App Logo" width={100} height={40} />
                </div>
                <Button variant="outline" className="btn bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                </Button>
            </header>


            {/* Category buttons */}
            <div className="p-4 flex flex-wrap gap-2 justify-center items-center">
                {Categories.map((category) => (
                    <Button
                        key={category.id}
                        variant={selectedChannelCategory === category ? "default" : "outline"}
                        onClick={() => handleChannelCategoryChange(category.insert_language)}
                        className={`btn ${selectedChannelCategory === category.insert_language ?
                            "bg-[var(--primary-color)] text-white" :
                            "text-[var(--primary-color)] hover:bg-[var(--secondary-color)] hover:text-white"}`}
                    >
                        {category.insert_language}
                    </Button>
                ))}
            </div>

            {/* Main content area */}
            <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
                {/* Video Player (left side, 60%) */}
                <div className="w-full md:w-3/5 p-4 flex flex-col">

                    <div className="flex-grow">
                        <MediaPlayer
                            title={currentChannel}
                            src={currentVideo}
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

                    <h2 className="text-xl font-semibold mt-2 text-center underline text-[var(--heading-text-color)]">Quick Watch</h2>

                    {/* Horizontal channel slider */}
                    <div className="mt-4 relative">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex">
                                {quick_watch.map((channel) => (
                                    <div key={channel.id} className="flex-[0_0_25%] min-w-0 px-2">
                                        <div className="p-2 text-center">
                                            <Image
                                                src={channel.image}
                                                alt={channel.channel_name}
                                                width={100}
                                                height={100}
                                                className="rounded-lg mb-2 mx-auto"
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '200px',
                                                    height: '100px',
                                                }}
                                            />
                                            <p className="font-medium text-sm truncate text-white">{channel.channel_name}</p>
                                            <Button
                                                size="sm"
                                                onClick={() => playChannel(channel)}
                                                className="btn mt-2 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]"
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
                            className="btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]"
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Scroll left</span>
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            className="btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]"
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Scroll right</span>
                        </Button>
                    </div>
                </div>

                {/* Channel List (right side, 40%) */}
                <div className="w-full md:w-2/5 p-4">
                    <h2 className="text-2xl font-bold mb-4 text-[var(--heading-text-color)]">
                        {selectedChannelCategory === 'all' ? 'All Channels' : `${selectedChannelCategory} Channels`}
                    </h2>
                    <ScrollArea className="h-[calc(100vh-180px)]">
                        {AllChannels.map((channel) => (
                            <div key={channel.id} className="flex items-center mb-4 p-2 hover:bg-[var(--secondary-color)] hover:text-white rounded-lg cursor-pointer">
                                <Image src={channel.image} alt={channel.channel_name} width={50} height={50} className="rounded-full mr-4" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-white">{channel.channel_name}</h3>
                                    <p className="text-sm text-[var(--paragraph-text-color)]">{channel.plan_name}</p>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => playChannel(channel)}
                                    className="btn bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]"
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