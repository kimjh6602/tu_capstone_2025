import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ClothingGenerator from './pages/ClothingGenerator';
import Catalog from './pages/Catalog';
import VirtualFitting from './pages/VirtualFitting';
import Community from './pages/Community';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import BlogList from './pages/BlogList';
import PostDetail from "./pages/PostDetail";


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clothing-generator" element={<ClothingGenerator />} />
        <Route path="/virtual-fitting" element={<VirtualFitting />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/community" element={<BlogList />} />
        <Route path="/blog/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;