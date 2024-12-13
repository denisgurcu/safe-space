import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FinalPage.css';

const FinalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [animationStopped, setAnimationStopped] = useState(false);
  const backgroundAudioRef = useRef(null); // Refs will hold the audio element

  const backgroundSound = location.state?.audio;
  const backgroundImage = location.state?.background || localStorage.getItem('breathSelectedBackground');

  useEffect(() => {
    console.log('Background Sound:', backgroundSound);
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    }

    if (backgroundSound && !backgroundAudioRef.current) {
      // Initialize and play the background sound
      const audio = new Audio(backgroundSound);
      audio.loop = true;
      audio.play().then(() => {
        console.log('Audio initialized and playing:', audio);
        backgroundAudioRef.current = audio; // Store the audio instance in ref
      }).catch((error) => console.error('Audio Playback Error:', error));
    }

    return () => {
      // Cleanup the audio when component unmounts
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null; // Reset the reference on unmount
      }
      document.body.style.backgroundImage = 'none';
    };
  }, [backgroundSound, backgroundImage]);

  const stopBackgroundSound = () => {
    console.log('Attempting to stop background sound...', backgroundAudioRef.current);
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause(); // Pause the audio
      backgroundAudioRef.current = null; // Reset the reference
      console.log('Background sound stopped.');
    } else {
      console.log('No background sound to stop.');
    }
  };

  const toggleAnimation = () => {
    setAnimationStopped((prev) => !prev);
  };

  const changeBackgroundSound = () => {
    stopBackgroundSound();
    navigate('/sound');
  };

  const changeBackgroundImage = () => {
    navigate('/breath');
  };

  return (
    <div className="final-page">
      {/* Added Container for "Now, let's breathe!" */}
      <div className="instruction-container">
        <h2>Now, let's breathe!</h2>
      </div>

      <div className={`wrap ${animationStopped ? 'paused' : ''}`}>
        {Array.from({ length: 10 }, (_, i) => (
          <div className="circle" key={i} style={{ transform: `rotate(${36 * (i + 1)}deg)` }}>
            <div className="circle-inner"></div>
          </div>
        ))}
      </div>

      <div className="button-container">
        <button
          className="control-btn"
          onClick={() => {
            console.log('Stop Background Sound Button Clicked');
            stopBackgroundSound();
          }}
        >
          Stop Background Sound
        </button>
        <button className="control-btn" onClick={toggleAnimation}>
          {animationStopped ? 'Resume Animation' : 'Stop Animation'}
        </button>
        <button className="control-btn" onClick={changeBackgroundSound}>
          Change Background Sound
        </button>
        <button className="control-btn" onClick={changeBackgroundImage}>
          Change Background Image
        </button>
      </div>
    </div>
  );
};

export default FinalPage;
