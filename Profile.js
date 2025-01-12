import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://127.0.0.1:5000/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
            setProfile(response.data);
          } else {
            setError('Unable to fetch profile');
          }
      } catch (error) {
        setError('Failed to fetch profile. Please log in again.');
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (profile === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {error && <p className="error">{error}</p>}
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <h2>Borrowed Books</h2>
      <ul>
        {profile.borrowed_books.map((book, index) => (
          <li key={index}>
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Borrow Date: {book.borrow_date}</p>
            <p>Quantity: {book.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;