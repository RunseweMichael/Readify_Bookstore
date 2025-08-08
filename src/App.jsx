import React, { useState, useEffect } from 'react';

export default function App() {
  // const BASE_URL = "http://127.0.0.1:8000/api/books";
  const isDevelopment = import.meta.env.MODE === 'development';
  const BASE_URL = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY;

  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !publishedDate) {
      alert('Please fill in all fields');
      return;
    }

    const newBook = { title, author, published_date: publishedDate };
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });
      if (!response.ok) throw new Error('Failed to add book');
      const data = await response.json();
      setBooks((prev) => [...prev, data]);
      setTitle('');
      setAuthor('');
      setPublishedDate('');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${BASE_URL}`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateTitle = async (pk, author, published_date) => {
    try {
      const response = await fetch(`${BASE_URL}${pk}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, author, published_date }),
      });
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      setBooks((prev) => prev.map((book) => (book.id === pk ? data : book)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async (pk) => {
    try {
      const response = await fetch(`${BASE_URL}${pk}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.title}>📚 READIFY</h1>

      <form style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Book Title</label>
          <input
            type="text"
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Author</label>
          <input
            type="text"
            style={styles.input}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Published Date</label>
          <input
            type="date"
            style={styles.input}
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
          />
        </div>

        <button type="submit" style={styles.addButton} onClick={handleSubmit}>
          Add Book
        </button>
      </form>

      <div style={styles.booksContainer}>
        {books.map((book) => (
          <div key={book.id} style={styles.card}>
            <p><strong>📖 Title:</strong> {book.title}</p>
            <p><strong>✍️ Author:</strong> {book.author}</p>
            <p><strong>📅 Release:</strong> {book.published_date}</p>

            <input
              type="text"
              placeholder="Edit title..."
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ ...styles.input, marginTop: '10px' }}
            />
            <div style={styles.cardButtons}>
              <button style={styles.updateButton} onClick={() => updateTitle(book.id, book.author, book.published_date)}>Update</button>
              <button style={styles.deleteButton} onClick={() => deleteBook(book.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    backgroundColor: '#1f1f2e',
    color: '#f5f5f5',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    fontSize: '4rem',
    marginBottom: '2rem',
    color: '#00ffd9',
  },
  form: {
    backgroundColor: '#292941',
    padding: '1.5rem',
    borderRadius: '12px',
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    padding: '0.6rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#1f1f2e',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#00ffd9',
    color: '#000',
    padding: '0.7rem 1.2rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '1rem',
  },
  booksContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#2e2e3e',
    padding: '1rem',
    borderRadius: '12px',
    width: '300px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  },
  cardButtons: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#00aaff',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};