import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SoundCard from '../components/SoundCard';
import './Sound.css';

const predefinedCategories = [
    { title: 'Forest', query: 'forest rain, ambient nature sounds' },
    { title: 'Ocean', query: 'calming ocean, beach sounds' },
    { title: 'Rain', query: 'soothing rain, peaceful rain sounds' },
    { title: 'Piano', query: 'soft piano, peaceful piano sounds' },
];

const Sound = () => {
    const [query, setQuery] = useState(''); // State for search input
    const [sounds, setSounds] = useState([]); // State for fetched sound results
    const [loading, setLoading] = useState(false); // State for loading status
    const [error, setError] = useState(null); // State for error message
    const [activeCategory, setActiveCategory] = useState(null); // State for active category
    const [backgroundAudio, setBackgroundAudio] = useState(null); // State for currently playing audio
    const [backgroundSound, setBackgroundSound] = useState(null); // State for currently set background sound

    const navigate = useNavigate();

    useEffect(() => {
        // Restore the background image from localStorage
        const savedBackground = localStorage.getItem('breathSelectedBackground');
        if (savedBackground) {
            document.body.style.backgroundImage = `url(${savedBackground})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
        }

        return () => {
            // Stop background sound on unmount
            if (backgroundAudio) {
                backgroundAudio.pause();
                setBackgroundAudio(null);
            }
        };
    }, []); // Runs only once on mount

    const fetchSounds = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setError('Please enter a search term.'); // Set error if search query is empty
            return;
        }

        setLoading(true); // Set loading state to true when fetching starts
        setError(null); // Reset error message

        try {
            const response = await axios.get('https://freesound.org/apiv2/search/text/', {
                params: {
                    query: searchQuery,
                    token: 'ztjtIn09cADN5OVNHx7IFDDFY1FCAHNWCDlhgcy6',
                    page_size: 12,
                },
            });

            if (response.data.results?.length) {
                // Fetch sound details and add preview URLs
                const soundsWithPreviews = await Promise.all(
                    response.data.results.map(async (sound) => {
                        const details = await axios.get(`https://freesound.org/apiv2/sounds/${sound.id}/`, {
                            params: {
                                token: 'ztjtIn09cADN5OVNHx7IFDDFY1FCAHNWCDlhgcy6',
                            },
                        });
                        return { ...sound, previews: details.data.previews };
                    })
                );
                setSounds(soundsWithPreviews); // Set sounds with preview URLs
            } else {
                setError('No sounds found for your search term.'); // Set error if no sounds found
            }
        } catch (error) {
            console.error('Error fetching sounds:', error); // Log error in console
            setError('Failed to fetch sounds. Please try again.'); // Set error message on failure
        } finally {
            setLoading(false); // Set loading state to false once fetching is complete
        }
    };

    useEffect(() => {
        fetchSounds('ambient sounds'); // Default search term when component mounts
    }, []);

    const handleSetBackgroundSound = (previewUrl) => {
        // Toggle play/pause background sound
        if (backgroundAudio && backgroundSound === previewUrl) {
            backgroundAudio.pause(); // Pause if sound is already playing
            setBackgroundAudio(null);
            setBackgroundSound(null);
        } else {
            if (backgroundAudio) backgroundAudio.pause(); // Pause current sound before playing a new one
            const newAudio = new Audio(previewUrl);
            newAudio.loop = true; // Loop the sound
            newAudio.play(); // Play the new sound
            setBackgroundAudio(newAudio); // Set new audio as background
            setBackgroundSound(previewUrl); // Set the preview URL as background sound
        }
    };

    const handleContinue = () => {
        // Navigate to the final page with background image and sound state
        navigate('/final-page', {
            state: {
                background: localStorage.getItem('breathSelectedBackground'), // Persist background image
                audio: backgroundSound, // Pass the sound to FinalPage
            },
        });
    };

    return (
        <div className="sound-page">
            <h1>Which sound helps you feel at ease?</h1>

            {/* Explanatory Text */}
            <p>Select an audio below to set your background sound, then click continue at the bottom!</p>

            <div className="categories">
                {predefinedCategories.map((category) => (
                    <button
                        key={category.title}
                        className={`category-btn ${activeCategory === category.title ? 'active' : ''}`}
                        onClick={() => {
                            setActiveCategory(category.title); // Set active category
                            fetchSounds(category.query); // Fetch sounds for selected category
                        }}
                    >
                        {category.title}
                    </button>
                ))}
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Select a category or search for a sound (e.g., guitar, beach...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)} // Update query on input change
                />
                <button className="search-btn" onClick={() => fetchSounds(query)} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'} {/* Show loading state if searching */}
                </button>
            </div>

            {error && <p className="error-message">{error}</p>} {/* Display error message if there's an error */}

            <div className="sound-results">
                {sounds.map((sound) => (
                    <SoundCard
                        key={sound.id}
                        sound={sound}
                        handleSetBackground={handleSetBackgroundSound} // Pass handler to set background sound
                        isBackground={backgroundSound === sound.previews['preview-hq-mp3']} // Check if the sound is currently set as background
                    />
                ))}
            </div>

            <div className="continue-btn-wrapper">
                <button className="continue-btn" onClick={handleContinue}>
                    Continue
                </button>
            </div>
        </div>
    );
};

export default Sound;
