import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Search from './Search';
import Login from './Login';
import reportWebVitals from './reportWebVitals';
import Profile from './Profile';
import Register from './Register';
import BorrowedBooks from './BorrowedBooks';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/borrowedbooks" element={<BorrowedBooks />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();