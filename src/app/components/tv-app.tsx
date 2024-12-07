'use client'

import { useState, useCallback, useEffect, SetStateAction } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { PlayCircle, ChevronLeft, ChevronRight, User } from 'lucide-react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import logoImg from "../../../public/logo.svg";
import playstoreIcon from "../../image/playstore.svg";
import axios from 'axios';
import { Menu, X } from 'lucide-react'; 
import LiveVideoPlayer from './VideoPlayer';
import Link from 'next/link';


export default function TVApp() {
    const homeUrl = '/';
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(true)
    const [ channelChanged , setChannelChanged ] = useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: 4, align: 'start' })
    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    const [currentVideo, setCurrentVideo] = useState("")
    const [currentChannel, setCurrentChannel] = useState('')
    const [selectedChannelCategory, setSelectedChannelCategory] = useState('Hindi')
    const [quick_watch, setquick_watch] = useState([])
    const [Categories, setCategories] = useState([])
    const [AllChannels, SetAllChannels] = useState([])
  
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";
        script.async = true;
        script.onload = () => {
          console.log("Google IMA SDK successfully loaded:", window.google);
        };
        script.onerror = () => {
          console.error("Failed to load Google IMA SDK");
        };
        document.body.appendChild(script);
      
        return () => {
          document.body.removeChild(script);
        };
      }, [currentVideo]);
      

    // const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    // const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_API_AUTH_TOKEN;
    const ACCOUNT_LINK ="https://myaccount.neotvapp.com"
    const API_BASE_URL = 'https://api-houston.khabriya.in/api/v3';
    const API_AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmZGQ3YjMzLWY2ZGItNDNlOC05NmM0LTFkNDMyYjc2NDI4NCIsIm1hY19hZGRyZXNzIjoibWFjX2FkZHJlc3MiLCJpYXQiOjE3MzE5NDE0NTF9.RrgsywJ4zNcTfER0Kd48bQZWCQoKO3GOmqYF0PBhPfyc1MOoXwTXVSQzYV1k-60Ch3sD8lWMXFOtC9rFIzOKSFD8hpzoQSzG07FpOLdtgYASuD49pBCk-1EsEOAArX3dWoumHe0C52Uw-NvABdDM1lLIMcQZxsh1DTA1SxMZUfGuPX5oMmdXdFKqyRX0LX8Xa_aDfvA7dhvyPsdqxyMXn_ieeJK9BzzW5NJYKW68gwpOAF6yjzJI-lDYQHKBeqsXSXEpL_vaESdLnZT-gBgvzuC6GgoMCwO8YVu99X7OWc-dDYvS35JJ9Oq0WePm-WBbRHe61iUD4UmsFZS4SCO_3A';

    const [CountOnly , SetCountOnly] = useState(0);

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
        console.log("Running Count of All channels is >>>>>>>>>>>>>>>>")
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
                setCurrentChannel(response.data.data[0].channel_name);
                setCurrentVideo(response.data.data[0].stream_url);
            }

        } catch (error) {
            console.error('Error fetching channels:', error);
        }
    }, [selectedChannelCategory]);

    useEffect(() => {
        fetchAllChannels();
    }, [selectedChannelCategory]);

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
    // -----------------------Deep links End-------------------------//
   
    // const playChannel = (channel) =>{
    //     setCurrentVideo(channel?.stream_url);
    //     setCurrentChannel(channel?.channel_name);
    // }
    // useEffect(()=>{
    //     playChannel()
    // },[currentVideo,currentChannel])

    const playChannel = useCallback((channel: {
        channel(channel_name: any): unknown; videoUrl: SetStateAction<string>; name: SetStateAction<string>;

    }) => {
        setChannelChanged(true);
        setCurrentVideo(channel.stream_url);
        setCurrentChannel(channel.channel_name);
        const slug = channel.channel_name.replace(/\s+/g, '-').toLowerCase();
        window.history.replaceState(null, '', `/${encodeURIComponent(slug)}`);
    }, [currentVideo,currentChannel]);

    // if(!currentVideo){
    //     return "sdfsdf";
    // }

    return (
        <div className=" md:mx-6 mx-2 ">
            {/* <header className="flex justify-between items-center p-4 text-white header">
                <div className="flex items-center">
                    <Link href={homeUrl} passHref>
                        <Image src={logoImg} alt="TV App Logo" width={100} height={40} />
                    </Link>
                </div>
                <Button variant="outline" className="acc_btn btn bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] hover:text-white hidden md:flex">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                </Button>
                <Button
                    variant="outline"
                    className="md:hidden bg-white text-black"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? (
                        <X className="h-6 w-6 text-black bg-white" /> // Visible cross icon
                    ) : (
                        <Menu className="h-6 w-6 text-black bg-white" /> // Visible menu icon
                    )}
                </Button>
            </header>  */}


            <header className="flex justify-between items-center md:px-8 px-4 py-4 text-white header">
                <div className="flex items-center">
                    <Link href={homeUrl} passHref>
                        <Image src={logoImg} alt="TV App Logo" width={140} height={40} className="logo" />
                    </Link>
                </div>
                <div className='flex items-center'>
                    <Link href={homeUrl} passHref>
                        <Image src={playstoreIcon} alt="TV App Logo" width={120} height={40} className="logo hidden md:flex" />
                    </Link>
                    <Link href={ACCOUNT_LINK}>
                        <Button variant="outline" className="acc_btn btn bg-[var(--primary-color)] text-white  hover:text-white hidden md:flex"
                            style={{ backgroundColor: 'var(--primary-color)' }}>
                            <User className="mr-2 h-4 w-4" />
                            My Account
                        </Button>
                    </Link>
                </div>

                <div className="flex justify-between items-center md:hidden">
                    <Link href={homeUrl} passHref>
                        <Image src={playstoreIcon} alt="TV App Logo" width={120} height={40} className="logo " />
                    </Link>
                    <Button
                        variant="outline"
                        className="md:hidden bg-white text-black toggle_btn"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-black bg-white" />
                        ) : (
                            <Menu className="h-6 w-6 text-black bg-white toggle_btn" />
                        )}
                    </Button>
                </div>
            </header>


            {/* Mobile Menu: Slide in from the right */}
            <div
                className={`${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    } fixed top-0 right-0 h-full w-3/4 mobile_bg bg-opacity-80 p-4 transition-transform duration-300 ease-in-out md:hidden z_index`}
            >
                <div className="flex justify-end ">
                    <Button onClick={toggleMenu} variant="outline" className="text-white toggle_btn">
                        <X className="h-6 w-6 text-black bg-white" />
                    </Button>
                </div>

                {Categories.map((category) => (
                    <span
                        key={category.id}
                        onClick={() => {
                            handleChannelCategoryChange(category.insert_language);
                            setIsMenuOpen(false);
                        }}
                        className={`block text-white text-lg mt-3 cursor-pointer px-4 py-2 rounded-md transition-colors duration-300 ${selectedChannelCategory === category.insert_language
                            ? 'bg-[var(--primary-color)] text-white'
                            : 'hover:bg-[var(--secondary-color)] text-[var(--primary-color)]'
                            }`}
                    >
                        {category.insert_language}
                    </span>
                ))}

                <div className="my-4">
                    <Button
                        variant="outline"
                        className="acc_btn btn  text-white w-1/2 py-4"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                        <User className="mr-2 h-4 w-4" />
                        My Account
                    </Button>
                </div>
            </div>

            {/* Desktop Category buttons (always visible on desktop) */}
            <div className="p-4 flex flex-wrap gap-2 justify-center items-center hidden md:flex">
                {/* {Categories && (
                    <h2 className="text-2xl font-bold text-[var(--heading-text-color)]">Sort By</h2>
                )} */}
                {Categories.map((category) => (
                    <Button
                        key={category.id}
                        variant={selectedChannelCategory === category ? 'default' : 'outline'}
                        onClick={() => handleChannelCategoryChange(category.insert_language)}
                        className={`btn ${selectedChannelCategory === category.insert_language
                            ? 'bg-[var(--primary-color)] text-white'
                            : 'text-text-white bg-transparent'
                            }`}
                    >
                        {category.insert_language}
                    </Button>
                ))}
            </div>


            {/* Main content area */}
            <div className="flex flex-col md:flex-row ">
                <div className="w-full md:w-4/6 p-4 ">
                    <div className="flex-grow">
                        <LiveVideoPlayer
                            currentVideo={currentVideo}
                            channelChanged={channelChanged}
                        />
                    </div>

                    <h2 className="text-2xl font-bold mb-4  mt-4 text-[var(--heading-text-color)]">Quick Watch</h2>

                    {/* Horizontal channel slider */}
                    <div className="mt-4 relative ">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex">
                                {quick_watch.map((channel) => (
                                    <div key={channel.id} className="lg:flex-[0_0_18%] flex-[0_0_25%] min-w-0 px-2">
                                        <div className="p-2 text-center channels_image">
                                            <Image
                                                src={channel.image}
                                                alt={channel.channel_name}
                                                width={100}
                                                height={100}
                                                className="rounded-lg mb-2 mx-auto"
                                                style={{
                                                    objectFit: 'cover',
                                                    width: '50px',
                                                    height: '50px',
                                                }}
                                            />
                                            <p className="font-medium text-sm truncate text-white">{channel.channel_name}</p>
                                            <Button
                                                size="sm"
                                                onClick={() => playChannel(channel)}
                                                className=" acc_btn btn mt-2 bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]"
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
                            className="btn_style btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-transparent	 text-white hover:bg-transparent hover:text-white"
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Scroll left</span>
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            className="btn_style btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-transparent	 text-white hover:bg-transparent hover:text-white"
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Scroll right</span>
                        </Button>
                    </div>
                </div>

                {/* Channel List (right side, 40%) */}
                <div className="w-full md:w-2/6 p-4 "  >
                    <h2 className="text-2xl font-bold mb-4 text-[var(--heading-text-color)]">
                        {selectedChannelCategory === 'all' ? 'All Channels' : `${selectedChannelCategory} Channels`}
                    </h2>
                    <ScrollArea className="h-[calc(100vh-180px)]">
                        {AllChannels.map((channel) => (
                            <div
                                key={channel.id}
                                className={`relative flex items-center mb-4 p-2 rounded-lg cursor-pointer channels_image 
                                ${currentChannel === channel.channel_name ? 'bg-[var(--secondary-color)] text-white' : 'hover:bg-[var(--secondary-color)] hover:text-white group'}`}
                            >
                                {/* Channel Thumbnail */}
                                <Image
                                    src={channel.image}
                                    alt={channel.channel_name}
                                    width={50}
                                    height={50}
                                    className="mr-4"
                                />

                                {/* Channel Details */}
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-white">{channel.channel_name}</h3>
                                    <p className="text-sm text-[var(--paragraph-text-color)]">{channel.add_language}</p>
                                </div>

                                {/* Play Button */}
                                <div
                                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 
                                    ${currentChannel === channel.channel_name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                >
                                    {currentChannel === channel.channel_name ? (
                                        <Button
                                            size="sm"
                                            disabled
                                            className="btn bg-[var(--primary-color)] text-white"
                                        >
                                            <PlayCircle className="h-5 w-5 mr-1" />
                                            Now Playing
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            onClick={() => playChannel(channel)}
                                            className="btn bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]"
                                        >
                                            <PlayCircle className="h-5 w-5 mr-1" />
                                            Play
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}