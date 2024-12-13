import React from 'react';
import { Link } from 'react-router-dom'; 
import './Home.css';

const Home = () => {
  const exercises = [
    { title: 'A Breath of Fresh Air', path: '/breath' },
    { title: 'The Mood Cupid', path: '/mood-cupid' },
    { title: 'Did You Mean...?', path: '/reframing' },
  ];

  return (
    <div className="landing-page">
      <section className="hero">
        <h1>Welcome to Safe Space</h1>
        <div className="scroll-indicator">
          <span>↓</span>
        </div>
      </section>
      <div className="content">
        <section className="intro">
          <p>
            In a world that’s always moving, it’s important to have a place where
            you can pause, and just be. This space is designed to help you navigate
            your emotions and, have some fun. These exercises are created to offer you
            simple, interactive ways to engage with your mental well-being and bring a
            sense of calm, clarity, and balance.
          </p>
          <p>
            Please select an exercise below to begin your journey!
          </p>
        </section>
        <div className="exercises">
          {exercises.map((exercise, index) => (
            <Link key={index} to={exercise.path} className="exercise-card">
              <h2>{exercise.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
