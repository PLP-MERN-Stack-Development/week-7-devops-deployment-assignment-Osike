import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ConstitutionPage from './pages/ConstitutionPage';
import BillOfRightsPage from './pages/BillOfRightsPage';
import AboutPage from './pages/AboutPage';
import DisclaimerPage from './pages/DisclaimerPage';
import LegalAidPage from './pages/LegalAidPage';
// import VideoComponent from './components/VideoComponent';

function App() {
  return (
    <Router>
      {/* VideoComponent outside the main content wrapper, so it's always in the background */}
      {/* <VideoComponent /> */}
      <div className="min-h-screen relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/constitution" element={<ConstitutionPage />} />
          <Route path="/bill-of-rights" element={<BillOfRightsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/legal-aid" element={<LegalAidPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;