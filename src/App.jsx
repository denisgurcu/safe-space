import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './pages/Home';
import Breath from './pages/Breath';
import ImageDetails from './pages/ImageDetails';
import Favs from './pages/Favs';
import Sound from './pages/Sound';
import FinalPage from './pages/FinalPage'; 


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="breath" element={<Breath />} />
          <Route path="details" element={<ImageDetails />} />
          <Route path="favs" element={<Favs />} />
          <Route path="sound" element={<Sound />} />
          <Route path="final-page" element={<FinalPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
