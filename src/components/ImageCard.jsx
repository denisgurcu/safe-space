import React from 'react';
import IonIcon from '@reacticons/ionicons';
import './ImageCard.css';

const ImageCard = ({
  image,
  isFavorite,
  handleFavClick,
  handleSetBackground,
  handleDetailsClick,
  cardNumber,
  isDetailsPage, // This prop indicates if we're on the details page or not
}) => {
  const handleImageClick = () => {
    // Check if we are on the ImageDetails page
    if (isDetailsPage) {
      // Trigger both the details click and set the background
      handleDetailsClick(image);
      handleSetBackground(image.src.original || image.src.large);
    } else {
      // On Breath page: only set the background
      handleSetBackground(image.src.original || image.src.large);
    }
  };

  return (
    <div className="polaroid-card">
      <div className="card-header">
        <span className="card-number">[{cardNumber}]</span>
        <div className="card-actions">
          <button
            className={`heart-icon ${isFavorite ? 'favorited' : ''}`}
            onClick={() => handleFavClick(image)}
          >
            <IonIcon name="heart" />
          </button>
          {/* Only show the info button if we're not on the details page */}
          {!isDetailsPage && (
            <button className="info-button" onClick={() => handleDetailsClick(image)}>
              <IonIcon name="information-circle" />
            </button>
          )}
        </div>
      </div>

      {/* Clickable Image */}
      <img
        src={image.src.medium}
        alt={image.alt}
        className="polaroid-image"
        loading="lazy"
        onClick={handleImageClick}  //  triggers details click and background update on image click
      />
    </div>
  );
};
export default ImageCard;
