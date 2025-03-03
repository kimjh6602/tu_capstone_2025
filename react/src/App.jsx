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
<<<<<<< HEAD
import BlogList from './pages/BlogList';
import PostDetail from "./pages/PostDetail";

=======
import CreatePalette from "./pages/CreatePalette.jsx";
>>>>>>> 19f101fcf1fc7b0236206df82c2d2981078f1c54

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
<<<<<<< HEAD
        <Route path="/post/:id" element={<PostDetail />} />

=======
        <Route path="/catalog/create" element={<CreatePalette />} />/
>>>>>>> 19f101fcf1fc7b0236206df82c2d2981078f1c54
      </Routes>
    </div>
  );
}

export default App;