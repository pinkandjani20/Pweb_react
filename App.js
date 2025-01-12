import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Search from './Search';
import BorrowedBooks from './BorrowedBooks';

function App() {
  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <h1>📖 Book Lending Service</h1>
          <p className="tagline">Find your next favorite book with ease!</p>
        </div>
        <div className="header-shape"></div>
      </header>

      {/* Main Content Section */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <h2>Welcome to the World of Books</h2>
              <p>
                Discover a treasure trove of stories, knowledge, and inspiration. Dive into our vast collection today!
              </p>
              <div className="cta-buttons">
                <Link to="/search" className="btn primary-btn">Explore Now</Link>
                <Link to="/login" className="btn secondary-btn">Login</Link>
              </div>
            </>
          } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/borrowed-books" element={<BorrowedBooks />} />
        </Routes>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2025 Book Lending Service | Crafted with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
