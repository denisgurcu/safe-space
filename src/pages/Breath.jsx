import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Breath.css';
import ImageCard from '../components/ImageCard';

const predefinedCategories = [
  { title: "Forest", query: "calm forest, ambient nature" },
  { title: "Ocean", query: "calm ocean, peaceful beach" },
  { title: "Starry Night", query: "starry sky, ambient night" },
  { title: "Sky", query: "calm sky, ambient clouds" },
  { title: "Mountain", query: "calm mountains, ambient nature" },
];

const Breath = () => {
  const [images, setImages] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('calm nature');
  const [selectedImage, setSelectedImage] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const gridRef = useRef(null);

  // Fetch images based on the search query
  const fetchImages = async (query) => {
    try {
      const combinedQuery = `${query} ambient wallpaper`;
      const url = `https://api.pexels.com/v1/search?query=${combinedQuery}&per_page=12`;
      const response = await axios.get(url, {
        headers: {
          Authorization: 'LoMLMPs6TTD9bKIgH5D84oofbhEdINB1H9auN3rsCxvF6FZz0m0FaPeg',
        },
      });

      const filteredImages = response.data.photos.filter(
        (photo) => photo.width >= 1920 && photo.height >= 1080
      );

      setImages(filteredImages.slice(0, 12));
    } catch (error) {
      console.error('Error fetching images:', error);
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
    // Only apply the background if on the Breath page
    if (location.pathname === '/breath') {
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
      if (location.pathname === '/breath') {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = 'var(--blue)';
      }
    };
  }, [selectedImage, location.pathname]);

  useEffect(() => {
    fetchImages(searchQuery);
  }, [searchQuery]);

  // Fav function
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (image) => {
    setFavorites((prev) => {
      const updatedFavorites = prev.some((fav) => fav.id === image.id)
        ? prev.filter((fav) => fav.id !== image.id)
        : [...prev, image];

      // Save updated favorites to localStorage
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  // Handle click on image details to navigate to another page
  const handleDetailsClick = async (image) => {
    try {
      const similarQuery = `${image.alt} ambient wallpaper`;
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${similarQuery}&per_page=12`,
        {
          headers: { Authorization: 'LoMLMPs6TTD9bKIgH5D84oofbhEdINB1H9auN3rsCxvF6FZz0m0FaPeg' },
        }
      );

      const fetchedSimilarImages = response.data.photos;

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

  // Handle search input
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim() !== '') {
      setSearchQuery(searchInput.trim());
    }
  };

  // Reset search and background to default
  const resetToDefault = () => {
    setSelectedImage('');
    setSearchQuery('calm nature');
    setActiveCategory(null);
    localStorage.removeItem('selectedBackground');
  };

  const navigateToFavorites = () => {
    navigate('/favs');
  };

  return (
    <div className="breath-of-fresh-air">
      <h1>Where would you like to be right now?</h1>

      {/* Explanatory Text */}
      <p>Select an image below to set your background, then click continue at the bottom!</p>

      {/* Categories */}
      <div className="categories">
        {predefinedCategories.map((category, index) => (
          <button
            key={index}
            className={`category-btn ${activeCategory === category.title ? 'active' : ''}`}
            onClick={() => {
              setSearchQuery(category.query);
              setActiveCategory(category.title);
            }}
          >
            {category.title}
          </button>
        ))}
        <button className="reset-btn" onClick={resetToDefault}>
          Default
        </button>
        <button className="favorites-btn" onClick={navigateToFavorites}>
          Favorites
        </button>
      </div>

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Select a category or search for a background (e.g., river, sunrise...)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Image Grid */}
      <div className="grid-wrapper">
        <div className="image-grid" ref={gridRef}>
          {images.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              isFavorite={favorites.some((fav) => fav.id === image.id)}
              handleFavClick={toggleFavorite}
              handleSetBackground={setSelectedImage}
              handleDetailsClick={handleDetailsClick}
              cardNumber={index + 1}
              isDetailsPage={location.pathname === '/details'}
            />
          ))}
        </div>
      </div>

      {/* Continue Button at the Bottom */}
      <div className="continue-btn-wrapper">
        <button
          className="continue-btn"
          onClick={() => {
            navigate('/sound', {
              state: { updatedBackground: selectedImage }, // Pass background as state
            });
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Breath;
