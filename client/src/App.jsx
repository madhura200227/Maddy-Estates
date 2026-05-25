import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Properties from './pages/Properties.jsx';
import PropertyDetail from './pages/PropertyDetail.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="app-main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
