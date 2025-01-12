import React, { useState, useEffect } from 'react';
import './BorrowedBooks.css';

function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    // Load borrowed books from localStorage or default data
    const storedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    setBorrowedBooks(storedBooks);
  }, []);

  const handleDelete = (borrowedBookId) => {
    const updatedBooks = borrowedBooks.filter(book => book.id !== borrowedBookId);
    setBorrowedBooks(updatedBooks);
    localStorage.setItem('borrowedBooks', JSON.stringify(updatedBooks)); // Sync with localStorage
  };

  const handleUpdate = (borrowedBookId, newBorrowDate) => {
    const updatedBooks = borrowedBooks.map(book => 
      book.id === borrowedBookId ? { ...book, borrow_date: newBorrowDate } : book
    );
    setBorrowedBooks(updatedBooks);
    localStorage.setItem('borrowedBooks', JSON.stringify(updatedBooks)); // Sync with localStorage
  };

  return (
    <div className="borrowed-books-container">
      <h1>Borrowed Books</h1>
      {borrowedBooks.length === 0 ? (
        <p>No books borrowed yet.</p>
      ) : (
        <ul>
          {borrowedBooks.map((book) => (
            <li key={book.id}>
              <p><span>Title:</span> {book.title}</p>
              <p><span>Author:</span> {book.author}</p>
              <p><span>Borrow Date:</span> {book.borrow_date}</p>
              <p><span>Quantity:</span> {book.quantity}</p>
              <button onClick={() => handleDelete(book.id)}>Delete</button>
              <button onClick={() => handleUpdate(book.id, prompt('Enter new borrow date:', book.borrow_date))}>Update Borrow Date</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BorrowedBooks;
