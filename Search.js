import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import './Search.css';

Modal.setAppElement('#root');

function Search() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowDate, setBorrowDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [borrowed, setBorrowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = (query = '') => {
    axios
      .get(`http://127.0.0.1:5000/books?search=${query}`)
      .then((response) => setBooks(response.data))
      .catch((error) => console.error('Error fetching books:', error));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchBooks(searchTerm);
  };

  const handleBorrow = (book) => {
    setSelectedBook(book);
    setBorrowDate(new Date().toLocaleDateString());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newBorrowedBook = {
      id: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author,
      borrow_date: borrowDate,
      quantity,
    };

    // Update localStorage
    const existingBorrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    const updatedBorrowedBooks = [...existingBorrowedBooks, newBorrowedBook];
    localStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowedBooks));

    setBorrowed(true);
    setTimeout(() => navigate('/borrowedbooks'), 2000); // Redirect after 2 seconds
  };

  return (
    <div className="search-container">
      <h1>Search for Books</h1>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a book..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-item">
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <button onClick={() => handleBorrow(book)}>Borrow</button>
          </div>
        ))}
      </div>
      {selectedBook && (
        <Modal
          isOpen={!!selectedBook}
          onRequestClose={() => setSelectedBook(null)}
          contentLabel="Borrow Book"
        >
          {!borrowed ? (
            <div>
              <h2>{selectedBook.title}</h2>
              <p>Author: {selectedBook.author}</p>
              <p>Description: {selectedBook.description}</p>
              <form onSubmit={handleSubmit}>
                <label>
                  Borrow Date:
                  <input type="text" value={borrowDate} readOnly />
                </label>
                <label>
                  Quantity:
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </label>
                <button type="submit">Confirm Borrow</button>
              </form>
            </div>
          ) : (
            <div>
              <h2>Thank you for borrowing the book!</h2>
              <p>Please return it within 30 days.</p>
              <button onClick={() => setSelectedBook(null)}>Close</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default Search;
