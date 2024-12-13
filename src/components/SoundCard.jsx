import React from 'react';
import './SoundCard.css';

const SoundCard = ({ sound, handleSetBackground, isBackground }) => {
    const handleSetBackgroundClick = () => {
        handleSetBackground(sound.previews['preview-hq-mp3']);
    };

    return (
        <div className="sound-card">
            <div className="sound-info">
                <span className="sound-name">{sound.name}</span>
            </div>

            <div className="audio-container">
                {sound.previews && sound.previews['preview-hq-mp3'] ? (
                    <audio controls>
                        <source src={sound.previews['preview-hq-mp3']} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                ) : (
                    <p>Preview not available</p>
                )}
            </div>

            {/* Spacer to push the button down */}
            <div className="spacer"></div>

            <div className="button-container">
                {/* Set as Background Button */}
                <button
                    className={`set-bg-btn ${isBackground ? 'playing' : ''}`}
                    onClick={handleSetBackgroundClick}
                >
                    {isBackground ? 'Stop Background' : 'Set as Background'}
                </button>
            </div>
        </div>
    );
};

export default SoundCard;
