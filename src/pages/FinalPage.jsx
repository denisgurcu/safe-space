import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FinalPage.css';

const FinalPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [animationStopped, setAnimationStopped] = useState(false);
  const backgroundAudioRef = useRef(null);

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

    if (backgroundSound) {
      try {
        const audio = new Audio(backgroundSound);
        audio.loop = true;
        audio.play().then(() => {
          console.log('Audio initialized and playing:', audio);
          backgroundAudioRef.current = audio;
        }).catch((error) => console.error('Audio Playback Error:', error));
      } catch (error) {
        console.error('Audio Initialization Error:', error);
      }
    }

    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
      document.body.style.backgroundImage = 'none';
    };
  }, [backgroundImage, backgroundSound]);

  const stopBackgroundSound = () => {
    console.log('Attempting to stop background sound...', backgroundAudioRef.current);
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current = null;
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

