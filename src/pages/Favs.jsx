import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Favs.css';
import ImageCard from '../components/ImageCard';
import IonIcon from '@reacticons/ionicons';

const Favs = () => {
    const [favorites, setFavorites] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Load favorites from localStorage when the page loads
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    // Function to toggle favorite status (remove from favorites if already in list)
    const handleFavClick = (imageId) => {
        // Check if the image is already in the favorites
        const imageIndex = favorites.findIndex((fav) => fav.id === imageId);

        let updatedFavorites;
        if (imageIndex !== -1) {
            // Remove image if it's already in favorites
            updatedFavorites = favorites.filter((fav) => fav.id !== imageId);
        } else {
            // Add image to favorites if it's not already in the list
            const imageToAdd = favorites.find((fav) => fav.id === imageId);
            updatedFavorites = [...favorites, imageToAdd];
        }

        // Update the state and localStorage
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    // Handle details click for image (fetch similar images)
    const handleDetailsClick = async (image) => {
        try {
            // fetch based on image alt data and that has ambient wallpaper so not all random images are fetched.
            const similarQuery = `${image.alt} ambient wallpaper`;
            const response = await axios.get(
                //limit it to similar query and 12 per page
                `https://api.pexels.com/v1/search?query=${similarQuery}&per_page=12`,
                {
                    //API key
                    headers: { Authorization: 'LoMLMPs6TTD9bKIgH5D84oofbhEdINB1H9auN3rsCxvF6FZz0m0FaPeg' },
                }
            );

            const fetchedSimilarImages = response.data.photos;
            
            // show similar images on details page
            navigate('/details', {
                state: {
                    image: {
                        ...image,
                        src: {
                            ...image.src,
                            large: image.src.original,
                        },
                    },
                    similarImages: fetchedSimilarImages,
                    favorites,
                },
            });
        } catch (error) {
            console.error('Error fetching similar images:', error);
        }
    };

    useEffect(() => {
        // If a background is passed through navigate, use it
        if (location.state && location.state.updatedBackground) {
            const updatedBackground = location.state.updatedBackground;
            setSelectedImage(updatedBackground);
        } else {
            // Otherwise, load from localStorage
            const savedBackground = localStorage.getItem('breathSelectedBackground');
            if (savedBackground) {
                setSelectedImage(savedBackground);
            }
        }
    }, [location]);

    useEffect(() => {
        // Only apply the background if on the Favs page
        if (location.pathname === '/favs') {
            if (selectedImage) {
                document.body.style.backgroundImage = `url(${selectedImage})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundAttachment = 'fixed';

                // Save to localStorage to persist across sessions
                localStorage.setItem('breathSelectedBackground', selectedImage);
            } else {
                document.body.style.backgroundImage = 'none';
                document.body.style.backgroundColor = 'var(--blue)';
            }
        }

        return () => {
            // Reset the background when leaving the page
            if (location.pathname === '/favs') {
                document.body.style.backgroundImage = 'none';
                document.body.style.backgroundColor = 'var(--blue)';
            }
        };
    }, [selectedImage, location.pathname]);

    return (
        <div className="favorites-page">
            <h1>Your Favorite Spaces</h1>

            {favorites.length > 0 ? (
                <div className="favorites-grid">
                    {favorites.map((image, index) => (
                        <ImageCard
                            key={image.id}
                            image={image}
                            isFavorite={true}
                            handleFavClick={() => handleFavClick(image.id)} // Pass image id to handleFavClick
                            handleSetBackground={setSelectedImage} // Set background on image click
                            handleDetailsClick={() => handleDetailsClick(image)} // Handle details click to navigate and fetch similar images
                            cardNumber={index + 1} // Pass the card number (index + 1)
                        />
                    ))}
                </div>
            ) : (
                <p>No favorites yet!</p>
            )}

            {/* Back Button */}
            <button className="back-button" onClick={() => navigate(-1)}>
                <IonIcon name="chevron-back-outline" />
            </button>
        </div>
    );
};

export default Favs;
