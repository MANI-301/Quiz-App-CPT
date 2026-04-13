import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="brand">📚 Book Manager</Link>
        <Link to="/" className="nav-link">All Books</Link>
        <Link to="/add" className="nav-link">Add Book</Link>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/"         element={<BookList />} />
          <Route path="/add"      element={<BookForm />} />
          <Route path="/edit/:id" element={<BookForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}