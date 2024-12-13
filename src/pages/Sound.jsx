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
    const [query, setQuery] = useState('');
    const [sounds, setSounds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [backgroundAudio, setBackgroundAudio] = useState(null);
    const [backgroundSound, setBackgroundSound] = useState(null);

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
            setError('Please enter a search term.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://freesound.org/apiv2/search/text/', {
                params: {
                    query: searchQuery,
                    token: 'ztjtIn09cADN5OVNHx7IFDDFY1FCAHNWCDlhgcy6',
                    page_size: 12,
                },
            });

            if (response.data.results?.length) {
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
                setSounds(soundsWithPreviews);
            } else {
                setError('No sounds found for your search term.');
            }
        } catch (error) {
            console.error('Error fetching sounds:', error);
            setError('Failed to fetch sounds. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSounds('ambient sounds'); // Default search term
    }, []);

    const handleSetBackgroundSound = (previewUrl) => {
        if (backgroundAudio && backgroundSound === previewUrl) {
            backgroundAudio.pause();
            setBackgroundAudio(null);
            setBackgroundSound(null);
        } else {
            if (backgroundAudio) backgroundAudio.pause();
            const newAudio = new Audio(previewUrl);
            newAudio.loop = true;
            newAudio.play();
            setBackgroundAudio(newAudio);
            setBackgroundSound(previewUrl);
        }
    };

    const handleContinue = () => {
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
                            setActiveCategory(category.title);
                            fetchSounds(category.query);
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
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="search-btn" onClick={() => fetchSounds(query)} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="sound-results">
                {sounds.map((sound) => (
                    <SoundCard
                        key={sound.id}
                        sound={sound}
                        handleSetBackground={handleSetBackgroundSound}
                        isBackground={backgroundSound === sound.previews['preview-hq-mp3']}
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
