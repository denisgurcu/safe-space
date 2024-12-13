import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ImageDetails.css';
import ImageCard from '../components/ImageCard';
import gsap from 'gsap';
import axios from 'axios';
import IonIcon from '@reacticons/ionicons';

const ImageDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { image: initialImage, similarImages: initialSimilarImages, favorites: initialFavorites } = location.state || {};

    const [image, setImage] = useState(initialImage);
    const [similarImages, setSimilarImages] = useState(initialSimilarImages || []);
    const [favorites, setFavorites] = useState(initialFavorites || []);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [showSetBackground, setShowSetBackground] = useState(false);

    const imageRefs = useRef({});

    // Load initial background from localStorage when the component mounts
    useEffect(() => {
        const savedBackground = localStorage.getItem('backgroundImage');
        if (savedBackground) {
            document.body.style.backgroundImage = `url(${savedBackground})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
            setShowSetBackground(true);
        } else {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = 'var(--blue)';
        }

        return () => {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = 'var(--blue)';
        };
    }, []);

    // Update background when the image changes
    useEffect(() => {
        if (image) {
            const imageUrl = image.src.original || image.src.large;
            document.body.style.backgroundImage = `url(${imageUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';

            localStorage.setItem('backgroundImage', imageUrl);
            setShowSetBackground(true);
        } else {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = 'var(--blue)';
            setShowSetBackground(false);
        }
    }, [image]);

    useEffect(() => {
        if (isSidebarOpen) {
            gsap.set('.sidebar', { x: '100%' });
            gsap.to('.sidebar', { x: '0%', duration: 0.5 });
        } else {
            gsap.to('.sidebar', { x: '100%', duration: 0.5 });
        }
    }, [isSidebarOpen]);

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);
      
      const toggleFavorite = (image) => {
        const updatedFavorites = favorites.some((fav) => fav.id === image.id)
            ? favorites.filter((fav) => fav.id !== image.id)
            : [...favorites, image];
    
        setFavorites(updatedFavorites);
    
        // Save updated favorites to localStorage
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const handleDetailsClick = async (selectedImage) => {
        setImage(selectedImage);  // Set the selected image to be displayed
    
        const similarQuery = `${selectedImage.alt} ambient wallpaper`;
        try {
            const response = await axios.get(
                `https://api.pexels.com/v1/search?query=${similarQuery}&per_page=12`,
                {
                    headers: { Authorization: 'LoMLMPs6TTD9bKIgH5D84oofbhEdINB1H9auN3rsCxvF6FZz0m0FaPeg' },
                }
            );
            setSimilarImages(response.data.photos);  // Fetch similar images
        } catch (error) {
            console.error('Error fetching similar images:', error);
        }
    };

    const handleSetBackground = (imageUrl) => {
        // Apply background image style
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
    
        // Save the background in localStorage
        localStorage.setItem('backgroundImage', imageUrl);
    
        // Navigate to the Breath page with the updated background
        navigate('/breath', { state: { updatedBackground: imageUrl } });
    };


    return (
        <div className="image-details-page">
            <div className="details-overlay">
                <div className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
                    <button className="close-button" onClick={() => setIsSidebarOpen(false)}>
                        <IonIcon name="close-outline" />
                    </button>

                    <div className="description">
                        <p>{image?.alt || 'No description available'}</p>
                        
                    </div>

                    <div className="image-frame">
                        {isLoading && (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                            </div>
                        )}
                        <img
                            ref={(el) => (imageRefs.current.mainImage = el)}
                            src={image?.src.original || image?.src.large}
                            alt={image?.alt}
                            className={`image-content ${isLoading ? 'hidden' : ''}`}
                            loading="lazy"
                            onLoad={() => setIsLoading(false)}
                        />
                    </div>

                    <div className="photographer-info">
                        <p className="photographer-name">{image?.photographer || 'Photographer: Unknown'}</p>
                    </div>
                    <div className="button-group">
                        <div className="download-button">
                            <button onClick={() => window.open(image?.src.original || image?.src.large, '_blank')}>
                                Download Image
                            </button>
                        </div>

                        {showSetBackground && (
                            <button className="set-background-button" onClick={() => handleSetBackground(image.src.original || image.src.large)}>
                                Set as Background
                            </button>
                        )}
                    </div>

                    <div className="details-content">
                        <h3>More like this</h3>
                        <div className="image-details-similar-grid">
                            {similarImages.map((img, index) => (
                                <ImageCard
                                    key={img.id}
                                    image={img}
                                    isFavorite={favorites.some((fav) => fav.id === img.id)}
                                    handleFavClick={toggleFavorite}
                                    handleSetBackground={() => {}} // Ensure this does not trigger background change on click
                                    handleDetailsClick={handleDetailsClick}
                                    cardNumber={index + 1}
                                    isDetailsPage={true} // Set true to hide the "info" button and enable the click behavior
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {!isSidebarOpen && (
                    <button className="info-button-image-details" onClick={() => setIsSidebarOpen(true)}>
                        <IonIcon name="information-circle" />
                    </button>
                )}

                <button className="back-button" onClick={() => navigate(-1)}>
                    <IonIcon name="chevron-back-outline" />
                </button>
            </div>
        </div>
    );
};

export default ImageDetails;
